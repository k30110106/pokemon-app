import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { POKEMON_TYPE_COLORS } from "../constants/colors";

// 포켓몬 타입 리스트 (필요에 따라 추가/수정 가능)
const POKEMON_TYPES = [
  "grass",
  "fire",
  "water",
  "electric",
  "bug",
  "normal",
  "poison",
  "ground",
  "fairy",
  "fighting",
  "psychic",
  "rock",
];

interface Props {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClear: () => void;
}

export default function TypeFilter({
  selectedTypes,
  onToggleType,
  onClear,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* 전체 해제 버튼 */}
        <TouchableOpacity
          style={[styles.chip, selectedTypes.length === 0 && styles.activeChip]}
          onPress={onClear}
        >
          <Text
            style={[
              styles.text,
              selectedTypes.length === 0 && styles.activeText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* 타입별 칩 */}
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? POKEMON_TYPE_COLORS[type]
                    : "#f0f0f0",
                },
              ]}
              onPress={() => onToggleType(type)}
            >
              <Text style={[styles.text, isSelected && styles.activeText]}>
                {type} {isSelected && "✓"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeChip: {
    backgroundColor: "#ff4444", // 강조색
    borderColor: "#ff4444",
  },
  text: {
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});
