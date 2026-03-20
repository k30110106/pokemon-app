import { THEME_COLORS } from "@/constants/colors";

// 언어 설정 타입
export type LanguageType = "en" | "ko" | "ja";

// 테마 상태 관리를 위한 Zustand 스토어에서 사용할 타입 정의
export interface ThemeStateProps {
  theme: "light" | "dark";
  colors: typeof THEME_COLORS.light;
  toggleTheme: () => void;
}

// 언어 상태 관리를 위한 Zustand 스토어에서 사용할 타입 정의
export interface LanguageStateProps {
  language: LanguageType; // 현재 선택된 언어
  setLanguage: (lang: LanguageType) => void; // 언어 변경 함수
}
