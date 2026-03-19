import asyncio  # 비동기 처리를 위한 파이썬 기본 도구
import requests # 인터넷에서 데이터를 가져오는 도구
from motor.motor_asyncio import AsyncIOMotorClient # MongoDB 연결 도구

# 지원하는 언어 목록 (PokeAPI에서 다국어 이름을 가져올 때 사용)
TARGET_LANGUAGE = ["ko", "en", "ja"]

# PokeAPI URL 설정
POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon" # 포켓몬 기본 정보 URL
POKEAPI_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species" # 포켓몬 종 정보 URL
POKEAPI_SPRITE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated" # 포켓몬 애니메이션 스프라이트 URL (gif 형식)

# MongoDB 설정
MONGO_URL = "mongodb://localhost:27017" # 로컬 MongoDB URL
DB_NAME = "pokedex" # 사용할 데이터베이스 이름

# 포켓몬 진화 체인 데이터를 리스트 형태로 변환하는 함수
# TODO: 이브이와 같이 분기진화 케이스 발생, 단일 진화뿐만 아니라 분기 진화도 처리할 수 있도록 개선 필요
def parse_evolution_chain(chain_data):
    evolution_list = [] # 진화 체인 데이터를 저장할 리스트
    
    # 재귀 함수를 사용하여 진화 체인을 순회하면서 데이터를 추출합니다.
    def extract_evolution(current_step):
        pokemon_id = int(current_step['species']['url'].split('/')[-2]) # URL에서 포켓몬 ID 추출
        name = current_step['species']['name'] # 포켓몬 이름 추출
        sprite = f"{POKEAPI_SPRITE_URL}/{pokemon_id}.gif" # 포켓몬 애니메이션 이미지 URL 생성

        # 현재 단계의 포켓몬 정보를 리스트에 추가합니다.
        evolution_list.append({
            "id": pokemon_id,
            "name": name,
            "sprite": sprite      
        })
        
        # 현재 단계에서 다음 진화 단계가 있다면 재귀적으로 호출하여 계속 추출합니다.
        for next_evolution in current_step['evolves_to']:
            extract_evolution(next_evolution)
    
    extract_evolution(chain_data) # 진화 체인의 시작점부터 추출을 시작합니다.
    return evolution_list



# 포켓몬 데이터를 PokeAPI에서 가져와 MongoDB에 저장하는 비동기 함수입니다.
async def fetch_and_save_pokemon():
    client = AsyncIOMotorClient(MONGO_URL) # MongoDB 클라이언트 생성
    db = client[DB_NAME] # 사용할 데이터베이스 선택
    collection = db["pokemons"] # 포켓몬 데이터를 저장할 컬렉션 이름


    print("🚀 1~2세대 포켓몬 데이터 수집을 시작합니다...")

    # for i in range(1, 252): # 1~251번 포켓몬 수집 (1세대부터 2세대까지)
    for i in range(1, 10): # [테스트용] 1~9번 포켓몬만 수집
        try:
            # 포켓몬 기본 정보 가져오기
            response = requests.get(f"{POKEAPI_URL}/{i}")
            data = response.json()

            # 포켓몬 종 정보 가져오기 (진화체인, 다국어 이름)
            species_res = requests.get(f"{POKEAPI_SPECIES_URL}/{i}")
            species_data = species_res.json()

            # 진화 체인 URL에서 진화 체인 데이터를 가져와서 리스트 형태로 변환합니다.
            # TODO: 이브이와 같이 분기진화 케이스 발생, 단일 진화뿐만 아니라 분기 진화도 처리할 수 있도록 개선 필요
            evo_data = requests.get(species_data["evolution_chain"]["url"]).json()
            evo_chain = parse_evolution_chain(evo_data["chain"]) # 재귀 함수를 통해 리스트로 변환

            # 포켓몬 이름 데이터에서 지원하는 언어에 해당하는 이름만 딕셔너리로 추출합니다. 예시: {"ko": "이상해씨", "en": "Bulbasaur", "ja": "フシギダネ"}
            name_data = species_data["names"]
            name_dict = {item["language"]["name"]: item["name"] for item in name_data if item["language"]["name"] in TARGET_LANGUAGE} # 지원하는 언어에 해당하는 이름만 딕셔너리로 추출

            # 포켓몬의 스탯 정보를 딕셔너리 형태로 변환하여 쉽게 접근할 수 있도록 합니다. 예시: {"hp": 45, "attack": 49, "defense": 49, "speed": 45}
            stats_list = ["hp", "attack", "defense", "speed"] # 우리가 관심 있는 스탯 목록입니다.
            stats_dict = {stat: next((item["base_stat"] for item in data["stats"] if item["stat"]["name"] == stat), 0) for stat in stats_list}

            # 기타 데이터 추출
            types = [item["type"]["name"] for item in data["types"]] # 포켓몬의 타입 정보를 리스트로 추출합니다. 예시: ["grass", "poison"]
            sprite = data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"] # 포켓몬의 애니메이션 스프라이트 URL을 추출합니다.

            # 포켓몬 정보를 MongoDB에 저장하기 위한 딕셔너리를 생성합니다.
            pokemon_info = {
                "id": data["id"],
                "names": name_dict,
                "height": data["height"],
                "weight": data["weight"],
                "types": types,
                "sprite": sprite,
                "stats": stats_dict,
                "evolution_chain": evo_chain
            }

            # MongoDB에 포켓몬 정보를 저장합니다. 기존에 같은 ID가 있으면 업데이트, 없으면 새로 삽입하도록 upsert 옵션을 사용합니다.
            await collection.update_one(
                {"id": pokemon_info["id"]}, # 업데이트할 문서를 찾는 조건입니다. 여기서는 포켓몬 ID로 찾습니다.
                {"$set": pokemon_info}, # 업데이트할 내용을 지정합니다. 여기서는 전체 포켓몬 정보를 새로 설정합니다.
                upsert=True # 만약 해당 ID의 문서가 없으면 새로 삽입하도록 하는 옵션입니다.
            )

            if i % 10 == 0:
                print(f"✅ {i}번째 포켓몬 & 진화 데이터 저장 완료...")
            
            # API 서버에 부담을 주지 않도록 잠시 대기합니다. (PokeAPI의 요청 제한을 고려하여 0.05초 대기)
            await asyncio.sleep(0.05)
        except Exception as e:
            print(f"❌ {i}번 수집 중 에러 발생: {e}")

    print("🎉 모든 데이터 수집이 완료되었습니다!")

# 이 스크립트를 실행하는 명령입니다.
if __name__ == "__main__":
    asyncio.run(fetch_and_save_pokemon())