from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.core.config import db
from app.models.pokemon import PaginatedPokemonResponse, PokemonResponse
from typing import List

# 포켓몬 관련 API 라우터를 정의하는 파일입니다. APIRouter를 사용하여 포켓몬 관련 엔드포인트를 그룹화합니다.
router = APIRouter()

# [GET] /pokemons 주소로 요청이 오면 실행됩니다. 포켓몬 목록을 페이징 처리하여 반환합니다. 이름과 타입으로 필터링할 수 있습니다.
@router.get("/", response_model=PaginatedPokemonResponse)
async def get_all_pokemons(
    offset: int = 0, limit: int = 20, 
    name: str = "",
    types: Optional[List[str]] = Query(None, alias="type")
):
    # MongoDB 쿼리를 구성합니다.
    query = {}

    # 이름 필터링: 입력된 이름이 포켓몬 이름에 포함되는 경우를 찾습니다. 대소문자 구분 없이 부분 일치하도록 정규 표현식을 사용합니다.
    if name:
        # query["name"] = {"$regex": name, "$options": "i"}
        query["$or"] = [
            {"names.ko": {"$regex": name, "$options": "i"}},
            {"names.en": {"$regex": name, "$options": "i"}},
            {"names.ja": {"$regex": name, "$options": "i"}}
        ]

    # 타입 필터링: 입력된 타입 리스트 중 하나라도 포켓몬의 타입에 포함되는 경우를 찾습니다. $in 연산자를 사용하여 MongoDB 쿼리에 추가합니다.
    if types and len(types) > 0:
        query["types"] = {"$in": [item.lower() for item in types]}


    # 전체 일치하는 포켓몬 수를 먼저 계산합니다. MongoDB의 count_documents() 메서드를 사용하여 쿼리에 일치하는 문서의 총 개수를 가져옵니다.
    total_count = await db.pokemon.count_documents(query)
    
    # 실제 포켓몬 데이터를 쿼리하여 페이징 처리된 결과를 가져옵니다.
    # find() 메서드로 쿼리를 실행하고, sort()로 ID 순으로 정렬한 후, skip()과 limit()로 페이징 처리를 합니다.
    # to_list() 메서드를 사용하여 결과를 리스트 형태로 변환합니다. length 매개변수는 반환할 최대 문서 수를 지정합니다.
    cursor = db.pokemon.find(query).sort("id", 1).skip(offset).limit(limit)
    pokemons = await cursor.to_list(length=limit)

    # 반환할 데이터 구조를 구성합니다. 총 개수, 포켓몬 목록, 현재 오프셋과 리밋 정보를 포함하여 반환합니다.
    return {
        "total_count": total_count,
        "items": pokemons,
        "offset": offset,
        "limit": limit
    }



# [GET] /pokemons/{pokemon_id} 주소로 요청이 오면 실행됩니다. URL 경로에서 포켓몬 ID를 받아 해당 포켓몬의 상세 정보를 반환합니다.
@router.get("/{pokemon_id}", response_model=PokemonResponse)
async def get_pokemon_by_id(pokemon_id: int):
    # MongoDB에서 해당 ID의 포켓몬을 찾습니다. find_one() 메서드를 사용하여 ID가 일치하는 문서를 검색합니다.
    pokemon = await db.pokemon.find_one({"id": pokemon_id})

    # 포켓몬이 존재하지 않는 경우 404 Not Found 에러를 반환합니다. HTTPException을 사용하여 상태 코드와 에러 메시지를 지정합니다.
    if not pokemon:
        raise HTTPException(status_code=404, detail="포켓몬을 찾을 수 없습니다.")
    
    return pokemon