import asyncio  # 비동기 처리를 위한 파이썬 기본 도구
import requests # 인터넷에서 데이터를 가져오는 도구
from motor.motor_asyncio import AsyncIOMotorClient # MongoDB 연결 도구

# 1. 설정: 어디서 가져오고 어디에 저장할지 정합니다.
POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon"
MONGO_URL = "mongodb://localhost:27017" # 우리가 실행한 도커 DB 주소
DB_NAME = "pokedex"

async def fetch_and_save_pokemon():
    # MongoDB에 연결합니다.
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["pokemons"]

    print("🚀 1~3세대 포켓몬 데이터 수집을 시작합니다...")

    # 기획서 전략: 1번부터 386번(3세대 끝)까지 수집
    for i in range(1, 387):
        try:
            # API에 요청을 보냅니다. (예: https://pokeapi.co/api/v2/pokemon/1)
            response = requests.get(f"{POKEAPI_URL}/{i}")
            data = response.json()

            # [추가] PokeAPI의 stats 리스트를 파이썬 딕셔너리로 변환
            # PokeAPI 구조: [{'base_stat': 45, 'stat': {'name': 'hp'}}, ...]
            # 우리가 원하는 형태: {'hp': 45, 'attack': 49, ...}
            stats_dict = {s["stat"]["name"]: s["base_stat"] for s in data["stats"]}

            # 우리가 필요한 데이터만 골라냅니다.
            pokemon_info = {
                "id": data["id"],
                "name": data["name"],
                "height": data["height"],
                "weight": data["weight"],
                "types": [t["type"]["name"] for t in data["types"]],
                # 5세대 애니메이션 GIF 주소 (기획서 우선순위 반영)
                "sprite": data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"] 
                          or data["sprites"]["front_default"],
                "owned": False, # 기본값은 미보유
                "lang_pref": "ko", # 기본 언어 설정
                "stats": { 
                    # PokeAPI에서 가져온 능력치를 우리가 원하는 형태로 저장합니다.
                    # 만약 stats_dict에 해당 키가 없으면 0으로 기본값을 설정합니다.
                    "hp": stats_dict.get("hp", 0),
                    "attack": stats_dict.get("attack", 0),
                    "defense": stats_dict.get("defense", 0),
                    "speed": stats_dict.get("speed", 0),
                },
                # 진화 체인은 데이터 구조가 복잡하므로 일단 빈 리스트로 시작합니다.
                "evolution_chain": []
            }

            # 기획서 전략: 멱등성(Upsert) 적용
            # 이미 있으면 업데이트하고, 없으면 새로 만듭니다.
            await collection.update_one(
                {"id": pokemon_info["id"]}, # 찾을 조건
                {"$set": pokemon_info},      # 넣을 데이터
                upsert=True                  # 없으면 새로 생성!
            )

            if i % 10 == 0:
                print(f"✅ {i}번째 포켓몬 저장 완료...")
            
            # API 서버에 과부하를 주지 않기 위해 아주 잠깐 쉽니다.
            await asyncio.sleep(0.05)

        except Exception as e:
            print(f"❌ {i}번 수집 중 에러 발생: {e}")

    print("🎉 모든 데이터 수집이 완료되었습니다!")

# 이 스크립트를 실행하는 명령입니다.
if __name__ == "__main__":
    asyncio.run(fetch_and_save_pokemon())