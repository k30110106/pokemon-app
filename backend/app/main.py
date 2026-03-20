from fastapi import FastAPI
from app.api.pokemon import router as pokemon_router

# FastAPI 앱 생성
app = FastAPI(title="Pokédex Hybrid API")

# API 라우터 등록
# 포켓몬 관련 API 엔드포인트를 /pokemon 경로로 등록합니다. 태그는 "Pokemon"으로 설정하여 API 문서에서 그룹화할 수 있도록 합니다.
app.include_router(pokemon_router, prefix="/pokemon", tags=["Pokemon"])

# 루트 엔드포인트 정의
# [GET] / 주소로 요청이 오면 실행됩니다. 서버 상태를 확인할 수 있는 간단한 응답을 반환합니다.
@app.get("/")
async def root():
    return {"status": "online", "message": "도감 서버가 준비되었습니다!"}