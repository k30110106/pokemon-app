import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { PokemonEvolutionProps } from "@/types/pokemon";

interface EvolutionItemProps {
  step: PokemonEvolutionProps;
  onPress: (id: number) => void;
  textColor: string;
}

export default function EvolutionItem({
  step,
  onPress,
  textColor,
}: EvolutionItemProps) {
  // 1. 초기값은 애니메이션 GIF (리스트의 0번)
  const [imgUri, setImgUri] = useState(step.sprites[0]);

  // 포켓몬이 바뀌면 이미지 상태도 초기화
  useEffect(() => {
    setImgUri(step.sprites[0]);
  }, [step]);

  const handleImageError = () => {
    // 2. 로드 실패 시 정적 PNG (리스트의 1번)로 교체
    if (step.sprites.length > 1 && imgUri !== step.sprites[1]) {
      setImgUri(step.sprites[1]);
    }
  };

  return (
    <TouchableOpacity style={styles.evoItem} onPress={() => onPress(step.id)}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imgUri }}
          style={styles.evoImage}
          onError={handleImageError}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.evoName, { color: textColor }]}>{step.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  evoItem: {
    alignItems: "center",
    flex: 1,
  },
  imageWrapper: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 50,
    padding: 5,
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
});
