import { useInfiniteQuery } from "@tanstack/react-query";

// 1. API 통신 함수: queryKey에서 search 정보를 추출하여 사용합니다.
const fetchPokemons = async ({ pageParam = 0, queryKey }: any) => {
  const [_key, search] = queryKey; // queryKey: ["pokemons", search] 에서 값을 분리
  const limit = 20;

  // URL에 검색어(name) 파라미터 추가
  const response = await fetch(
    `http://192.168.0.7:8000/pokemons/?offset=${pageParam}&limit=${limit}&name=${search}`,
  );

  if (!response.ok) throw new Error("데이터 로드 실패");
  return response.json();
};

export const usePokemons = (search: string) => {
  return useInfiniteQuery({
    // ✅ 검색어(search)를 키에 포함시켜, 검색어가 바뀔 때마다 쿼리를 초기화하고 새로 요청합니다.
    queryKey: ["pokemons", search],
    queryFn: fetchPokemons,
    initialPageParam: 0,

    // 다음 페이지를 가져올 파라미터 계산 로직
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;

      // ✅ 서버에서 준 total_count를 바탕으로 다음 페이지 존재 여부 판단
      if (nextOffset >= lastPage.total_count) {
        return undefined; // 끝에 도달하면 다음 페이지 파라미터를 undefined로 반환
      }
      return nextOffset;
    },
  });
};
