import { create } from "zustand";
import { THEME_COLORS } from "@/constants/colors";
import { ThemeStateProps } from "@/types/store";

// 테마 상태 관리를 위한 Zustand 스토어 정의
export const useThemeStore = create<ThemeStateProps>((set) => ({
  theme: "light",
  colors: THEME_COLORS.light, // 초기값은 라이트 테마로 설정
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      return {
        theme: nextTheme,
        colors: THEME_COLORS[nextTheme],
      };
    }),
}));
