import { Pokemon } from "@/types/pokemon";
import { useQuery } from "@tanstack/react-query";

// 단일 포켓몬 상세 정보 fetch 함수
const fetchPokemonDetail = async (idOrName: number | string) => {
  const url = `http://192.168.0.7:8000/pokemons/${idOrName}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("포켓몬 상세 정보 로드 실패");
  return response.json();
};

// 상세 정보 커스텀 훅 (options 파라미터 추가)
export const usePokemonDetail = (idOrName: number | string, options?: any) => {
  return useQuery<Pokemon>({
    queryKey: ["pokemon", idOrName],
    queryFn: () => fetchPokemonDetail(idOrName),
    staleTime: 1000 * 60 * 5, // 5분간 신선도 유지
    // 새로운 데이터를 불러오는 동안 이전 데이터를 버리지 않고 유지함 -> UI가 깜빡이지 않고 부드럽게 업데이트됩니다.
    placeholderData: (previousData) => previousData,
    ...options, // 외부에서 넘겨준 enabled, initialData 등을 병합
  });
};
