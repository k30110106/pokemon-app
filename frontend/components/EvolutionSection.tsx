import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import EvolutionNode from "./EvolutionNode";

interface EvolutionSectionProps {
  rootNode: any;
  themeColor: string;
}

export default function EvolutionSection({
  rootNode,
  themeColor,
}: EvolutionSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColor }]}>Evolution Chain</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 진화객체 노드 */}
        <EvolutionNode node={rootNode} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
  },
  scrollContent: { paddingHorizontal: 10 },
});
