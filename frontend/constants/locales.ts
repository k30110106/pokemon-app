// 언어 설정 별로 메뉴 혹은 버튼 텍스트 UI를 적용합니다.
// TODO: 설정기능과 메뉴버튼을 만들면서 추가 및 적용예정
export const UI_TEXT = {
  ko: {
    settings: "설정",
    myPokemon: "내 포켓몬",
    save: "저장하기",
    stats: "능력치",
  },
  en: {
    settings: "Settings",
    myPokemon: "My Pokémon",
    save: "Save",
    stats: "Stats",
  },
  ja: {
    settings: "設定",
    myPokemon: "マイポケモン",
    save: "保存",
    stats: "ステータス",
  },
} as const;
// 오직 "설정"이라는 글자만 허용되는 읽기 전용 상태로 인식
// const일 경우는 타입지정을 하면 안됨!
