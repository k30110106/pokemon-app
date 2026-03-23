import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/useThemeStore"; // 테마 수신기
import { POKEMON_TYPE_COLORS } from "../constants/colors";

interface PokemonCardProps {
  item: any;
  onPress: (item: any) => void;
}

export default function PokemonCard({ item, onPress }: PokemonCardProps) {
  const { colors } = useThemeStore();

  const mainType = item.types[0];
  const backgroundColor = POKEMON_TYPE_COLORS[mainType] || "#f0f0f0";

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
          {item.names["en"]}
        </Text>

        <View style={styles.typeRow}>
          {item.types.map((t: string) => (
            <View
              key={t}
              style={[
                styles.typeBadge,
                { backgroundColor: POKEMON_TYPE_COLORS[t] },
              ]}
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
