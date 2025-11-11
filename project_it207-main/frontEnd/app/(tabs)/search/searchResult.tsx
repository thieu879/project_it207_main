import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

const { width } = Dimensions.get("window");

export default function SearchResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const q = typeof params.query === "string" ? params.query : "";

  const { products, fetchProducts, isLoading } = useProducts();

  useEffect(() => {
    (async () => {
      if (!q) return;
      try {
        await fetchProducts({ search: q, page: 0, limit: 30 });
      } catch {}
    })();
  }, [q, fetchProducts]);

  const renderProductCard = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Found results for {q}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {isLoading && products.length === 0 ? (
          <ActivityIndicator size="large" color="#000" />
        ) : products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#E5E5E5" />
            <Text style={styles.emptyText}>No products found for {q}</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProductCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#000000" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  resultsContainer: { flex: 1, marginTop: 8 },
  productCard: { flex: 1, margin: 8, maxWidth: (width - 64) / 2 },
  productImageContainer: { marginBottom: 10 },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  placeholderImage: { justifyContent: "center", alignItems: "center" },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#2C1810" },
  columnWrapper: { justifyContent: "space-between" },
  emptyState: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 12, color: "#9BA1A6" },
});
