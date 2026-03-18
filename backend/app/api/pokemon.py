from fastapi import APIRouter, Query
from typing import Optional
from app.core.config import db
from app.models.pokemon import PokemonResponse, PaginatedPokemonResponse
from typing import List

# 이 라우터는 포켓몬 관련 주소들을 묶어주는 역할을 합니다.
router = APIRouter()

# [GET] /pokemons 주소로 요청이 오면 실행됩니다.
@router.get("/", response_model=PaginatedPokemonResponse)
async def get_all_pokemons(
    offset: int = 0, limit: int = 20, 
    name: str = "", # 거의 모든 검색에서 이름은 빈 문자열로 시작하므로, 기본값을 ""로 설정합니다.
    types: Optional[List[str]] = Query(None, alias="type") # 외부에서는 'type'으로 받고 내부선 'pokemon_type'으로 사용
):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # 대소문자 구분 없이 검색

    if types and len(types) > 0:
        query["types"] = {"$in": [t.lower() for t in types]}  # types 리스트 중 하나라도 일치하는 포켓몬을 찾습니다.

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