import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  // : T <<< 반환 타입을 명시
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay(밀리초) 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 사용자가 다시 타이핑을 시작하면 이전 타이머를 취소 (핵심!)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
