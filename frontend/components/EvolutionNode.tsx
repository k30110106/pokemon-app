import { usePokemonStore } from "@/store/useEvolutionStore";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface EvolutionNodeProps {
  node: any;
}

// 재귀적 렌더링 노드
export default function EvolutionNode({ node }: EvolutionNodeProps) {
  const currentId = usePokemonStore((state) => state.currentId);
  const setCurrentId = usePokemonStore((state) => state.setCurrentId);

  return (
    <View style={styles.nodeWrapper}>
      <View style={styles.horizontalContainer}>
        {/* 현재 포켓몬 */}
        <TouchableOpacity
          onPress={() => setCurrentId(node.id)}
          style={styles.node}
        >
          <Image source={{ uri: node.sprite }} style={styles.image} />
          <Text
            style={[
              styles.name,
              currentId === node.id && { fontWeight: "900", fontSize: 12 },
            ]}
          >
            {node.names["en"]}
          </Text>
        </TouchableOpacity>

        {/* 자식 진화체가 있다면 화살표와 함께 렌더링 */}
        {node.evolution_chain && node.evolution_chain.length > 0 && (
          <View style={styles.branchContainer}>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.childrenColumn}>
              {node.evolution_chain.map((child: any) => (
                <EvolutionNode key={child.id} node={child} />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nodeWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: { width: 70, height: 70 },
  name: { fontSize: 12, marginTop: 5, fontWeight: "600", textAlign: "center" },

  branchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  childrenColumn: {
    flexDirection: "column", // 분기되는 애들을 위아래로 배치
    justifyContent: "center",
  },
  arrow: {
    fontSize: 18,
    color: "#ccc",
    marginHorizontal: 2,
    fontWeight: "bold",
  },
  node: {
    alignItems: "center",
    padding: 10,
    minWidth: 90,
  },
});
