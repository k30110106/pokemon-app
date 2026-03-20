import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import EvolutionSection from "./EvolutionSection";
import { POKEMON_TYPE_COLORS } from "@/constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DetailModal({
  isVisible,
  pokemon: listPokemon,
  onClose,
}: any) {
  const [currentId, setCurrentId] = useState<number | null>(null);

  // 모달이 열릴 때 리스트에서 받은 ID로 초기화
  useEffect(() => {
    if (isVisible && listPokemon) {
      setCurrentId(listPokemon.id);
    }
  }, [isVisible, listPokemon]);

  // 상세 데이터 fetch
  const { data: pokemon, isFetching } = usePokemonDetail(currentId!, {
    enabled: isVisible && !!currentId,
    placeholderData: (prev: any) => prev,
  });

  const displayPokemon = pokemon || listPokemon;
  if (!displayPokemon) return null;

  const mainType = displayPokemon.types?.[0]?.toLowerCase() || "normal";
  const themeColor = POKEMON_TYPE_COLORS[mainType] || "#777";

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 로딩 표시 */}
          {isFetching && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={themeColor} />
            </View>
          )}

          {/* 닫기 버튼 */}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 상단 이미지 영역 */}
            <View
              style={[
                styles.imageContainer,
                { backgroundColor: themeColor + "20" },
              ]}
            >
              <Image
                source={{ uri: displayPokemon.sprite }}
                style={styles.mainImage}
              />
            </View>
            {/* 기본 정보 */}
            <View style={styles.infoSection}>
              <Text style={styles.idText}>
                #{String(displayPokemon.id).padStart(3, "0")}
              </Text>
              <Text style={styles.nameText}>{displayPokemon.names["en"]}</Text>

              <View style={styles.typeContainer}>
                {displayPokemon.types?.map((type: string) => (
                  <View
                    key={type}
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          POKEMON_TYPE_COLORS[type.toLowerCase()],
                      },
                    ]}
                  >
                    <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
            {/* 스탯 섹션 */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                Base Stats
              </Text>
              {displayPokemon.stats &&
                Object.entries(displayPokemon.stats).map(
                  ([key, value]: [string, any]) => (
                    <View key={key} style={styles.statRow}>
                      <Text style={styles.statLabel}>{key.toUpperCase()}</Text>
                      <View style={styles.statBarBg}>
                        <View
                          style={[
                            styles.statBarFill,
                            {
                              width: `${(value / 150) * 100}%`,
                              backgroundColor: themeColor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.statValue}>{value}</Text>
                    </View>
                  ),
                )}
            </View>

            {/* 진화 섹션 (컴포넌트 분리) */}
            {displayPokemon.evolution_chain && (
              <EvolutionSection
                chain={displayPokemon.evolution_chain}
                currentId={currentId!}
                onNodePress={(id) => setCurrentId(id)}
                themeColor={themeColor}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: SCREEN_HEIGHT * 0.85,
    padding: 20,
  },
  loaderContainer: { position: "absolute", top: 25, right: 60, zIndex: 10 },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  closeText: { fontSize: 24, color: "#333", fontWeight: "bold" },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mainImage: { width: 180, height: 180 },
  infoSection: { alignItems: "center", marginBottom: 25 },
  idText: { fontSize: 16, color: "#888", fontWeight: "bold" },
  nameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  typeContainer: { flexDirection: "row", gap: 10, marginTop: 5 },
  typeBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  typeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statLabel: { width: 50, fontSize: 12, fontWeight: "bold", color: "#666" },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#EEE",
    borderRadius: 4,
    marginHorizontal: 10,
  },
  statBarFill: { height: "100%", borderRadius: 4 },
  statValue: {
    width: 30,
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
  },
});
