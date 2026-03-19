export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface EvolutionStep {
  id: number;
  name: string;
  sprites: string[];
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  owned: boolean;
  lang_pref: string;
  stats?: PokemonStats; // Optional (상세 데이터라 없을 수도 있음)
  evolution_chain?: EvolutionStep[]; // Optional
  //evolution_chain?: EvolutionNode;
}

export interface EvolutionNode {
  id: number;
  name: string;
  sprite: string;
  evolution_details?: {
    min_level?: number;
    item?: { name: string };
    trigger?: { name: string };
  }[];
  evolves_to?: EvolutionNode[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    // ... 기타 스탯
  };
  sprite: string;
  //evolution_chain?: EvolutionNode;
  evolution_chain?: EvolutionStep[];
}
