from pydantic import BaseModel
from typing import List, Optional

# 1. 능력치 모델
class PokemonStats(BaseModel):
    hp: int
    attack: int
    defense: int
    speed: int

# 2. 진화 단계 모델
class EvolutionStep(BaseModel):
    id: int
    name: str
    sprites: List[str] = []

# 3. [클라이언트 응답용]
class PokemonResponse(BaseModel):
    id: int
    name: str
    types: List[str]
    sprite: str
    owned: bool        # 프론트엔드에서 체크박스나 아이콘 표시용
    lang_pref: str     # 언어 설정 반영용
    stats: Optional[PokemonStats] = None
    evolution_chain: List[EvolutionStep] = []

# 4. [페이지네이션 응답용]
class PaginatedPokemonResponse(BaseModel):
    total_count: int
    items: List[PokemonResponse]
    offset: int
    limit: int

# 5. [실제 DB 저장용] - 모든 필드가 다 들어있어야 합니다!
class Pokemon(BaseModel):
    id: int
    name: str
    types: List[str]
    sprite: str
    owned: bool        # DB에 저장되어야 함
    lang_pref: str     # DB에 저장되어야 함
    stats: Optional[PokemonStats] = None
    evolution_chain: List[EvolutionStep] = []