import asyncio  # 비동기 처리를 위한 파이썬 기본 도구
import requests # 인터넷에서 데이터를 가져오는 도구
from motor.motor_asyncio import AsyncIOMotorClient # MongoDB 연결 도구

# 1. 설정: 어디서 가져오고 어디에 저장할지 정합니다.
POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon"
POKEAPI_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species" # [추가] 종 정보 URL
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "pokedex"

# 2. 진화 체인 데이터를 파싱하는 함수입니다.
def parse_evolution_chain(chain_data):
    """
    PokeAPI의 복잡한 트리 구조 진화 데이터를 리스트 형태로 변환합니다.
    예: ['이상해씨', '이상해풀', '이상해꽃']
    """
    evolution_list = []
    
    def extract_evolution(current_step):
        # 현재 단계의 포켓몬 이름 저장
        pokemon_id = int(current_step['species']['url'].split('/')[-2]) # URL에서 ID 추출
        name = current_step['species']['name']
        # 이미지는 나중에 프론트엔드에서 처리하거나 추가 API 호출이 필요하므로 우선 이름만!
        evolution_list.append({
            "id": pokemon_id,
            "name": name,
            "sprites": [f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/{pokemon_id}.gif",
                       f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon_id}.png"]
                       
        })
        
        # 다음 진화 단계가 있다면 재귀 호출
        for next_evolution in current_step['evolves_to']:
            extract_evolution(next_evolution)
            
    extract_evolution(chain_data)
    return evolution_list

# 3. 메인 함수: 데이터를 가져와서 MongoDB에 저장합니다.
async def fetch_and_save_pokemon():
    # MongoDB에 연결합니다.
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["pokemons"]

    print("🚀 1~3세대 포켓몬 데이터 수집을 시작합니다...")

    for i in range(1, 387):
    # for i in range(1, 10): # [테스트용] 1~9번 포켓몬만 수집
        try:
            # 1. 기본 포켓몬 정보 가져오기
            response = requests.get(f"{POKEAPI_URL}/{i}")
            data = response.json()
            stats_dict = {s["stat"]["name"]: s["base_stat"] for s in data["stats"]}

            # 2. [신규] 진화 체인 정보 가져오기
            # Species 정보를 먼저 가져와서 evolution_chain URL을 알아내야 합니다.
            species_res = requests.get(f"{POKEAPI_SPECIES_URL}/{i}")
            species_data = species_res.json()
            evo_url = species_data["evolution_chain"]["url"]
            
            evo_res = requests.get(evo_url)
            evo_data = evo_res.json()
            
            # 재귀 함수를 통해 리스트로 변환
            evolution_chain = parse_evolution_chain(evo_data["chain"])

            # 3. 데이터 조립
            pokemon_info = {
                "id": data["id"],
                "name": data["name"],
                "height": data["height"],
                "weight": data["weight"],
                "types": [t["type"]["name"] for t in data["types"]],
                "sprite": data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"] 
                          or data["sprites"]["front_default"],
                "owned": False,
                "lang_pref": "ko",
                "stats": {
                    "hp": stats_dict.get("hp", 0),
                    "attack": stats_dict.get("attack", 0),
                    "defense": stats_dict.get("defense", 0),
                    "speed": stats_dict.get("speed", 0),
                },
                "evolution_chain": evolution_chain # [수정] 빈 리스트 대신 실제 데이터 삽입
            }

            await collection.update_one(
                {"id": pokemon_info["id"]}, # 기존에 같은 ID가 있으면 업데이트, 없으면 새로 삽입
                {"$set": pokemon_info}, # 업데이트할 때는 $set을 사용하여 필요한 필드만 업데이트하도록 변경
                upsert=True # 업서트 옵션을 사용하여 존재하지 않는 경우 새로 삽입하도록 설정
            )

            if i % 10 == 0:
                print(f"✅ {i}번째 포켓몬 & 진화 데이터 저장 완료...")
            
            await asyncio.sleep(0.05)

        except Exception as e:
            print(f"❌ {i}번 수집 중 에러 발생: {e}")

    print("🎉 모든 데이터 수집이 완료되었습니다!")

# 이 스크립트를 실행하는 명령입니다.
if __name__ == "__main__":
    asyncio.run(fetch_and_save_pokemon())