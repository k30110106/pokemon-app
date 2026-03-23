import { useInfiniteQuery } from "@tanstack/react-query";

// API 통신 함수: queryKey에서 search 정보를 추출하여 사용합니다.
const fetchPokemons = async ({ pageParam = 0, queryKey }: any) => {
  const [_key, search, selectedTypes] = queryKey; // queryKey: ["pokemons", search] 에서 값을 분리
  const limit = 20;

  // URLSearchParams를 사용하여 쿼리 파라미터를 구성합니다.
  const params = new URLSearchParams({
    offset: pageParam.toString(),
    limit: limit.toString(),
  });

  // 검색어가 있을 때만 name 파라미터를 추가합니다.
  if (search) {
    params.append("name", search);
  }

  // 선택된 타입이 있을 때마다 type 파라미터를 추가합니다.
  if (selectedTypes && selectedTypes.length > 0) {
    selectedTypes.forEach((type: string) => {
      params.append("types", type);
    });
  }

  const url = `http://192.168.0.7:8000/pokemon/?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("데이터 로드 실패");
  return response.json();
};

export const usePokemons = ({
  search,
  selectedTypes,
}: {
  search: string;
  selectedTypes: string[];
}) => {
  // useInfiniteQuery를 사용하여 무한 스크롤과 검색/필터링 기능을 구현합니다.
  return useInfiniteQuery({
    // ✅ 검색조건들을 키에 포함시켜, 바뀔 때마다 쿼리를 초기화하고 새로 요청합니다.
    queryKey: ["pokemons", search, selectedTypes],
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

    // ✅ 검색어와 타입이 바뀌었을 때 기존 데이터를 유지하면서 새 데이터를 로드하도록 설정
    placeholderData: (previousData) => previousData,
  });
};
