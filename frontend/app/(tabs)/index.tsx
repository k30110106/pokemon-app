import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useThemeStore } from "../../store/useThemeStore";
import { usePokemons } from "../../hooks/usePokemons";
import { useDebounce } from "../../hooks/useDebounce";
import SearchBar from "../../components/SearchBar";
import PokemonCard from "../../components/PokemonCard";
import DetailModal from "../../components/DetailModal";
import TypeFilter from "@/components/TypeFilter";

export default function HomeScreen() {
  const { colors } = useThemeStore();

  // 검색어와 선택된 타입 상태 관리
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 상세 모달을 위한 선택된 포켓몬 상태
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  // 디바운스 적용: 입력을 멈추고 0.5초 뒤에 debouncedSearch가 업데이트됨
  const debouncedSearch = useDebounce({ search, selectedTypes }, 500);

  // 서버 데이터 페칭: 디바운스된 검색어를 서버로 전달
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePokemons(debouncedSearch);

  // 데이터 가공: 여러 페이지로 나뉜 데이터를 하나의 배열로 합침
  const allPokemons = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // 타입 토글 로직: 있으면 제거, 없으면 추가
  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // 타입 초기화 로직
  const handleClearTypes = () => setSelectedTypes([]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* 검색 바 */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* 다중 선택 타입 필터 */}
      <TypeFilter
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        onClear={handleClearTypes}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: colors.text }}>
            데이터를 불러오지 못했습니다. 😢
          </Text>
        </View>
      ) : (
        <FlatList
          data={allPokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PokemonCard item={item} onPress={() => setSelectedPokemon(item)} />
          )}
          contentContainerStyle={styles.listContent}
          // 무한 스크롤 설정
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          // 하단 로딩 표시
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ margin: 20 }}
              />
            ) : null
          }
          // 검색 결과 없음 처리
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.subText }]}>
                검색 결과가 없습니다.
              </Text>
            </View>
          }
        />
      )}

      {/* 상세 정보 모달 */}
      <DetailModal
        isVisible={!!selectedPokemon}
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
