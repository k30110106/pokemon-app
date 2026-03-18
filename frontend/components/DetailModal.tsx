import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useThemeStore } from "../store/useThemeStore";

const TYPE_COLORS: { [key: string]: string } = {
  fire: "#FF4422",
  water: "#3399FF",
  grass: "#77CC55",
  electric: "#FFCC33",
  poison: "#AA5599",
  bug: "#AABB22",
  flying: "#8899FF",
  normal: "#AAAA99",
  ground: "#DDBB55",
  fairy: "#EE99EE",
  psychic: "#FF5599",
  fighting: "#BB5544",
  rock: "#BBAA66",
  ice: "#66CCFF",
  dragon: "#7766EE",
  ghost: "#6666BB",
  steel: "#AAAABB",
};

interface DetailModalProps {
  isVisible: boolean;
  pokemon: any;
  onClose: () => void;
}

export default function DetailModal({
  isVisible,
  pokemon,
  onClose,
}: DetailModalProps) {
  const { colors } = useThemeStore();

  if (!pokemon) return null;

  // 첫 번째 타입을 기준으로 메인 테마 색상 결정 (없으면 기본값)
  const mainType = pokemon.types[0].toLowerCase();
  const themeColor = TYPE_COLORS[mainType] || "#777";

  // 1. 실제 데이터 구조에 맞게 매핑 (백엔드 응답 예시: { hp: 80, attack: 120 ... })
  const stats = [
    { label: "HP", value: pokemon.hp || 0, max: 255 },
    { label: "ATK", value: pokemon.attack || 0, max: 190 },
    { label: "DEF", value: pokemon.defense || 0, max: 230 },
    { label: "SPD", value: pokemon.speed || 0, max: 180 },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* 상단 배경을 타입 색상으로 강조 */}
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View
            style={[styles.headerBackground, { backgroundColor: themeColor }]}
          />

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: pokemon.sprite }}
                style={styles.largeImage}
              />
            </View>

            <Text style={[styles.nameText, { color: colors.text }]}>
              {pokemon.name}
            </Text>

            <View style={styles.typeRow}>
              {pokemon.types.map((t: string) => (
                <View
                  key={t}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: TYPE_COLORS[t.toLowerCase()] || "#777" },
                  ]}
                >
                  <Text style={styles.typeText}>{t.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            {/* 능력치(Stats) 시각화 섹션 추가 */}
            <View style={styles.statsContainer}>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                Base Stats
              </Text>
              {/* 예시 데이터: 나중에 DB에 HP, ATK 등이 추가되면 연결하세요! */}
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: colors.subText }]}>
                    {stat.label}
                  </Text>
                  <View style={styles.statBarBg}>
                    <View
                      style={[
                        styles.statBarFill,
                        {
                          // 최대치 대비 비율 계산
                          width: `${Math.min((stat.value / stat.max) * 100, 100)}%`,
                          // 테마 컬러를 쓰되, 수치가 낮으면 조금 더 투명하게 조절 가능
                          backgroundColor: themeColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* 진화 체인 */}
            <View style={styles.evolutionContainer}>
              <Text style={[styles.sectionTitle, { color: themeColor }]}>
                Evolution Chain
              </Text>

              <View style={styles.evolutionRow}>
                {/* 예시: 파이리 계열 (나중에 반복문으로 교체) */}
                <View style={styles.evoItem}>
                  <Image
                    source={{ uri: pokemon.sprite }}
                    style={styles.evoImage}
                  />
                  <Text style={[styles.evoName, { color: colors.text }]}>
                    Charmander
                  </Text>
                </View>

                <Text style={[styles.arrowText, { color: colors.subText }]}>
                  →
                </Text>

                <View style={styles.evoItem}>
                  <Image
                    source={{ uri: pokemon.sprite }}
                    style={styles.evoImage}
                  />
                  <Text style={[styles.evoName, { color: colors.text }]}>
                    Charmeleon
                  </Text>
                </View>

                <Text style={[styles.arrowText, { color: colors.subText }]}>
                  →
                </Text>

                <View style={styles.evoItem}>
                  <Image
                    source={{ uri: pokemon.sprite }}
                    style={styles.evoImage}
                  />
                  <Text style={[styles.evoName, { color: colors.text }]}>
                    Charizard
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "70%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    elevation: 10,
  },
  closeBtn: { alignSelf: "flex-end", padding: 10 },
  closeText: { fontSize: 24, fontWeight: "bold" },
  scrollContent: { alignItems: "center", paddingBottom: 40 },
  largeImage: { width: 200, height: 200 },
  idText: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  nameText: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 15,
  },
  typeRow: { flexDirection: "row", marginBottom: 20 },
  divider: { width: "100%", height: 2, marginVertical: 20 },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.2, // 은은하게 배경색 노출
  },
  imageContainer: {
    marginTop: -20, // 이미지 살짝 위로
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 10,
    elevation: 5,
  },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  typeText: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  statsContainer: { width: "100%", paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statLabel: { width: 40, fontSize: 12, fontWeight: "bold" },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statBarFill: { height: "100%", borderRadius: 4 },
  statValue: {
    width: 30,
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
  },
  evolutionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  evolutionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)", // 아주 연한 배경
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  evoItem: {
    alignItems: "center",
    flex: 1,
  },
  evoImage: {
    width: 60,
    height: 60,
  },
  evoName: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    textTransform: "capitalize",
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "bold",
    opacity: 0.3,
    marginHorizontal: 5,
  },
});
