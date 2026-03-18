from pydantic import BaseModel # 데이터의 타입을 강제하고, 유효성 검사를 자동으로 수행할 수 있습니다.
from typing import List

# 포켓몬 데이터의 "표준 양식"을 정의합니다.
class PokemonResponse(BaseModel):
    id: int
    name: str
    types: List[str]
    sprite: str
    owned: bool
    lang_pref: str

# 페이지네이션된 응답을 위한 모델입니다.
class PaginatedPokemonResponse(BaseModel):
    total_count: int
    items: List[PokemonResponse]
    offset: int
    limit: int