import { create } from "zustand";
import { LanguageType, LanguageStateProps } from "@/types/store";

// 언어 상태 관리를 위한 Zustand 스토어 정의
// TODO: 실제로 사용자의 언어설정에 따라 초기값을 설정하는 로직 추가 필요
export const useLanguageStore = create<LanguageStateProps>((set) => ({
  language: "en",
  setLanguage: (lang: LanguageType) => set({ language: lang }), // 언어 변경 함수
}));
