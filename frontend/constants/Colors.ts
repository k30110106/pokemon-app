// 포켓몬 타입별 색상
export const POKEMON_TYPE_COLORS: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D1D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// 테마별 색상 정의
export const THEME_COLORS: { [key: string]: { [key: string]: string } } = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#FF4422", // 포켓몬의 상징인 레드 계열 추가
    subText: "#666666",
    card: "#F0F0F0",
  },
  dark: {
    background: "#1A1A1A",
    text: "#FFFFFF",
    primary: "#FF5544", // 다크모드용 조금 더 밝은 레드
    subText: "#AAAAAA",
    card: "#2A2A2A",
  },
};
