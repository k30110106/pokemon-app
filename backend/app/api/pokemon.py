from fastapi import APIRouter
from app.core.config import db
from app.models.pokemon import PokemonResponse, PaginatedPokemonResponse
from typing import List

# 이 라우터는 포켓몬 관련 주소들을 묶어주는 역할을 합니다.
router = APIRouter()

# [GET] /pokemons 주소로 요청이 오면 실행됩니다.
@router.get("/", response_model=PaginatedPokemonResponse)
async def get_all_pokemons(offset: int = 0, limit: int = 20, name: str = ""):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # 대소문자 구분 없이 검색

    # 1. 전체 개수 미리 파악 (필터 조건이 있다면 동일하게 적용)
    total_count = await db.pokemons.count_documents(query)
    
    # 2. 기존 페이징 쿼리 실행
    # MongoDB의 find()는 커서를 반환하므로, to_list()로 실제 데이터를 가져옵니다.
    cursor = db.pokemons.find(query).sort("id", 1).skip(offset).limit(limit)
    pokemons = await cursor.to_list(length=limit)

    # 3. 데이터와 메타정보를 함께 반환
    return {
        "total_count": total_count,
        "items": pokemons,
        "offset": offset,
        "limit": limit
    }