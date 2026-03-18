// store/useThemeStore.ts
import { create } from "zustand";

// 색상표 정의 (기존과 동일)
// constants/Colors.ts
export const Colors = {
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

interface ThemeState {
  theme: "light" | "dark";
  colors: typeof Colors.light; // 현재 테마에 맞는 색상표
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  colors: Colors.light, // 초기값
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      return {
        theme: nextTheme,
        colors: Colors[nextTheme],
      };
    }),
}));
