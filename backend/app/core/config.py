# motor는 MongoDB를 비동기(Async)로 다루는 라이브러리입니다.
from motor.motor_asyncio import AsyncIOMotorClient

# DB 주소와 이름을 상수로 정의합니다.
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "pokedex"

# 서버 전체에서 사용할 DB 클라이언트를 생성합니다.
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME] # 이제 'db' 변수를 통해 데이터에 접근합니다.