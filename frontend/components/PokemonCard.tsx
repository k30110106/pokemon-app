import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/useThemeStore"; // 테마 수신기

// 타입별 색상 정의
const TYPE_COLORS: { [key: string]: string } = {
  fire: "#FF9C54",
  water: "#4E90AF",
  grass: "#7AC74C",
  electric: "#F7D02C",
  psychic: "#F95587",
  ice: "#96D9D6",
  dragon: "#6F35FC",
  fairy: "#D685AD",
  poison: "#A33EA1",
  flying: "#A98FF3",
  bug: "#A6B91A",
  normal: "#A8A77A",
  ground: "#E2BF65",
  rock: "#B6A136",
  steel: "#B7B7CE",
  ghost: "#735797",
};

interface PokemonCardProps {
  item: any;
  onPress: (item: any) => void;
}

export default function PokemonCard({ item, onPress }: PokemonCardProps) {
  const { colors } = useThemeStore();
  const mainType = item.types[0];
  const backgroundColor = TYPE_COLORS[mainType] || "#f0f0f0";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: backgroundColor,
          borderLeftWidth: 8,
          backgroundColor: colors.card,
        },
      ]}
      onPress={() => onPress(item)}
    >
      <Image source={{ uri: item.sprite }} style={styles.pokemonImage} />
      <View style={styles.cardInfo}>
        {/* ID 텍스트: 기존 #aaa 대신 테마의 보조 텍스트 색상 사용 */}
        <Text style={[styles.idText, { color: colors.subText }]}>
          #{String(item.id).padStart(3, "0")}
        </Text>

        {/* 이름 텍스트: 기존 #444 대신 테마의 메인 텍스트 색상 사용 */}
        <Text style={[styles.nameText, { color: colors.text }]}>
          {item.name}
        </Text>

        <View style={styles.typeRow}>
          {item.types.map((t: string) => (
            <View
              key={t}
              style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[t] }]}
            >
              <Text style={styles.typeText}>{t}</Text>
              {/* 타입 텍스트는 배경이 유색이므로 흰색(#fff) 고정이 더 잘 보일 수 있습니다! */}
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  cardInfo: { marginLeft: 20, flex: 1 },
  pokemonImage: { width: 80, height: 80 },
  idText: { fontSize: 14, color: "#aaa", fontWeight: "bold" },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#444",
  },
  typeRow: { flexDirection: "row", marginTop: 5 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
