from pydantic import BaseModel
from typing import List, Optional

# 포켓몬 목록을 페이징 처리하여 반환할 때 사용되는 모델입니다.
class PaginatedPokemonResponse(BaseModel):
    total_count: int # 전체 일치하는 포켓몬 수
    items: List[PokemonResponse] # 실제 포켓몬 데이터 리스트
    offset: int
    limit: int

# 클라이언트로 반환되는 포켓몬 데이터의 구조를 정의합니다.
class PokemonResponse(BaseModel):
    id: int
    names: Optional[PokemonNames]
    types: List[str]
    sprite: str
    stats: Optional[PokemonStats]
    evolution_chain: List[PokemonEvolution] = []

# 포켓몬 데이터 모델입니다. MongoDB에 저장되는 포켓몬 데이터의 구조를 정의합니다.
class PokemonDataBase(BaseModel):
    id: int
    names: Optional[PokemonNames]
    types: List[str] # 포켓몬의 타입 정보를 리스트로 저장합니다. 예시: ["grass", "poison"]
    sprite: str
    stats: Optional[PokemonStats]
    evolution_chain: List[PokemonEvolution] = []

# 포켓몬 진화 체인을 저장하는 모델입니다. 예시: {"id": 1, "names": {"ko": "이상해씨", "en": "Bulbasaur", "ja": "フシギダネ"}, "sprite": "...", evolves_chain: [...]}
# evolves_chain은 이브이 혹은 배루키와 같은 분기진화를 고려하여 설계합니다.
# List['PokemonEvolution']의 홀따옴표는 자기자신의 클래스를 정의하는 도중에 선언하였기 때문에 "전방참조"로 일단 문자열 취급시킵니다.
class PokemonEvolution(BaseModel):
    id: int
    names: Optional[PokemonNames]
    sprite: str
    evolves_chain: List['PokemonEvolution'] = []

# 포켓몬 스탯 정보를 저장하는 모델입니다. 예시: {"hp": 45, "attack": 49, "defense": 49, "speed": 45}
class PokemonStats(BaseModel):
    hp: int
    attack: int
    defense: int
    speed: int

# 포켓몬 이름 정보를 다국어로 저장하는 모델입니다. 예시: {"ko": "이상해씨", "en": "Bulbasaur", "ja": "フシギダネ"}
class PokemonNames(BaseModel):
    ko: str
    en: str
    ja: str