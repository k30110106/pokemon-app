import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useThemeStore } from "@/store/useThemeStore"; // 테마 수신기

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { colors, theme } = useThemeStore();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
            color: colors.text,
          },
        ]}
        placeholder="포켓몬 이름을 검색하세요..."
        placeholderTextColor={colors.subText}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing" // 입력 시 X 버튼 활성화 (iOS 전용)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  input: {
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
  },
});
