import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.center}>
        <ThemedText type="title">Home</ThemedText>
        <ThemedText>Welcome!</ThemedText>
        <View style={styles.actions}>
          <Button
            title="Đăng nhập"
            onPress={() => router.push("/(auth)/login")}
          />
          <Button
            title="Đăng ký"
            variant="outline"
            onPress={() => router.push("/(auth)/signup")}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  actions: { marginTop: 24, gap: 12, width: 220 },
});
