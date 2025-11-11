import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types";

interface Props {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="image-outline" size={32} color="#9BA1A6" />
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {product.name}
      </Text>
      <Text style={styles.price}>${(product.price || 0).toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 8, maxWidth: 180 },
  imageContainer: { marginBottom: 8 },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  placeholder: { justifyContent: "center", alignItems: "center" },
  name: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "bold", color: "#2C1810" },
});
