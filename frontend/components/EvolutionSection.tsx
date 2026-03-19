import React from "react";
import { EvolutionStep } from "../types/pokemon";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface Props {
  chain: EvolutionStep[];
  currentId: number;
  onNodePress: (id: number) => void;
  themeColor: string;
}

export default function EvolutionSection({
  chain,
  currentId,
  onNodePress,
  themeColor,
}: Props) {
  // chain이 [이브이, 샤미드, 쥬피썬더...] 식의 배열인 경우
  if (!chain || chain.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColor }]}>Evolution Chain</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.listWrapper}>
          {chain.map((step: any, index: number) => (
            <View key={step.id} style={styles.stepContainer}>
              <TouchableOpacity
                onPress={() => onNodePress(step.id)}
                style={styles.node}
              >
                <Image source={{ uri: step.sprites[0] }} style={styles.image} />
                <Text style={styles.name}>{step.name}</Text>
              </TouchableOpacity>

              {/* 마지막 요소가 아니면 화살표 표시 */}
              {index < chain.length - 1 && <Text style={styles.arrow}>→</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  listWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  stepContainer: { flexDirection: "row", alignItems: "center" },
  node: { alignItems: "center", padding: 10 },
  image: { width: 70, height: 70 },
  name: { fontSize: 12, marginTop: 5, fontWeight: "600" },
  arrow: { fontSize: 20, color: "#ccc", marginHorizontal: 5 },
});
