from pydantic import BaseModel
from typing import List, Optional

# 포켓몬 목록을 페이징 처리하여 반환할 때 사용되는 모델입니다.
class PaginatedPokemonResponse(BaseModel):
    total_count: int # 전체 일치하는 포켓몬 수
    items: List[PokemonResponse] # 실제 포켓몬 데이터 리스트
    offset: int
    limit: int

# 클라이언트로 반환되는 포켓몬 데이터의 구조를 정의합니다.
# TODO: evolution_chain 필드는 단일 진화뿐만 아니라 분기 진화도 처리할 수 있도록 개선 필요
class PokemonResponse(BaseModel):
    id: int
    name: Optional[PokemonNames]
    types: List[str]
    sprite: str
    stats: Optional[PokemonStats]
    evolution_chain: List[PokemonEvolution] = []

# 포켓몬 데이터 모델입니다. MongoDB에 저장되는 포켓몬 데이터의 구조를 정의합니다.
# TODO: evolution_chain 필드는 단일 진화뿐만 아니라 분기 진화도 처리할 수 있도록 개선 필요
class PokemonDataBase(BaseModel):
    id: int
    name: Optional[PokemonNames]
    types: List[str] # 포켓몬의 타입 정보를 리스트로 저장합니다. 예시: ["grass", "poison"]
    sprite: str
    stats: Optional[PokemonStats]
    evolution_chain: List[PokemonEvolution] = []

# 포켓몬 이름 정보를 다국어로 저장하는 모델입니다. 예시: {"ko": "이상해씨", "en": "Bulbasaur", "ja": "フシギダネ"}
class PokemonNames(BaseModel):
    ko: str
    en: str
    ja: str

# 포켓몬 스탯 정보를 저장하는 모델입니다. 예시: {"hp": 45, "attack": 49, "defense": 49, "speed": 45}
class PokemonStats(BaseModel):
    hp: int
    attack: int
    defense: int
    speed: int

# 포켓몬 진화 체인 정보를 저장하는 모델입니다. 예시: [{"id": 1, "name": "Bulbasaur", "sprite": "https://.../1.gif"}, ...]
class PokemonEvolution(BaseModel):
    id: int
    name: str
    sprites: str