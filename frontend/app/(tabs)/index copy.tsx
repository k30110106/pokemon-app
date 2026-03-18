import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  Pressable,
} from "react-native";
// 1. 우리가 만든 테마 수신기 불러오기
import { useThemeStore } from "../../store/useThemeStore";
import PokemonCard from "../../components/PokemonCard";
import SearchBar from "@/components/SearchBar";
import DetailModal from "@/components/DetailModal";

export default function HomeScreen() {
  // 2. 방송국에서 colors(색상표), theme(현재상태), toggleTheme(전환함수) 꺼내기
  const { colors, theme, toggleTheme } = useThemeStore();

  const [pokemons, setPokemons] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  const fetchPokemons = async () => {
    try {
      const response = await fetch("http://192.168.0.7:8000/pokemons/");
      const data = await response.json();
      setPokemons(data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, pokemons]);

  return (
    // 3. 스타일 뒤에 [{ 고정스타일 }, { 테마스타일 }] 형태로 입혀줍니다.
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>
            Pokédex Hybrid
          </Text>

          {/* 테마 전환 버튼 (임시) */}
          <Pressable onPress={toggleTheme} style={styles.themeBtn}>
            <Text style={{ fontSize: 20 }}>
              {theme === "light" ? "🌙" : "☀️"}
            </Text>
          </Pressable>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={filteredPokemons}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            onPress={() => {
              setSelectedPokemon(item);
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      {/* ✅ 2. 독립시킨 상세 모달 배치 */}
      <DetailModal
        isVisible={!!selectedPokemon}
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 26, fontWeight: "bold" },
  themeBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  searchBar: { padding: 12, borderRadius: 15, fontSize: 16 },
  listContent: { padding: 15 },
});
