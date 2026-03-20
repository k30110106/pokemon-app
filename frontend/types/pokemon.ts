export interface Pokemon {
  id: number;
  names: PokemonNamesProps;
  types: string[];
  sprite: string;
  stats?: PokemonStatsProps;
  evolution_chain?: PokemonEvolutionProps[];
}

export interface PokemonNamesProps {
  ko: string;
  en: string;
  ja: string;
}

export interface PokemonStatsProps {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface PokemonEvolutionProps {
  id: number;
  name: string;
  sprites: string;
}
