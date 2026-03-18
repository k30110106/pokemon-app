from fastapi import FastAPI
# 우리가 만든 pokemon 통로(router)를 가져옵니다.
from app.api.pokemon import router as pokemon_router

# FastAPI 앱 생성
app = FastAPI(title="Pokédex Hybrid API")

# 중요: 포켓몬 관련 통로를 서버에 등록합니다.
# 이제 모든 포켓몬 관련 주소는 앞에 "/pokemons"가 붙습니다.
app.include_router(pokemon_router, prefix="/pokemons", tags=["Pokemon"])

@app.get("/")
async def root():
    return {"status": "online", "message": "도감 서버가 준비되었습니다!"}