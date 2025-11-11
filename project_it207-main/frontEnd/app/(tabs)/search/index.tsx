import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/ui/Input";
import { router } from "expo-router";
import { useRecentSearches } from "@/hooks/useRecentSearches";

const { width } = Dimensions.get("window");
const RECENT_KEY = "@recent_searches";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  // search screen only captures query and recent items; results are on the results page

  const [query, setQuery] = useState("");
  const { recent, saveRecent, clearRecent } = useRecentSearches();
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    // load recent searches
    (async () => {
      try {
        // Removed AsyncStorage logic, now handled by useRecentSearches hook
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const onSubmit = async (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    await saveRecent(q); // Now using the hook's saveRecent
    // navigate to searchResult page with query param
    router.push(`/search/searchResult?query=${encodeURIComponent(q)}`);
  };

  const onChangeText = (text: string) => {
    setQuery(text);
    // debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSubmit(text);
    }, 450);
  };

  // clearRecent now comes from hook

  // product rendering moved to searchResult.tsx

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoGem}>Gem</Text>
          <Text style={styles.logoStore}>Store</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Input
          placeholder="Search products..."
          leftIcon="search"
          value={query}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmit()}
        />

        {/* Recent searches */}
        {recent.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipsRow}>
              {recent.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={styles.chip}
                  onPress={() => {
                    setQuery(r);
                    onSubmit(r);
                  }}
                >
                  <Text style={styles.chipText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.resultsContainer}>
          <View style={styles.hintRow}>
            <Ionicons name="caret-forward-outline" size={18} color="#9BA1A6" />
            <Text style={styles.hintText}>
              Results will show on the results page
            </Text>
          </View>
        </View>
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
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoGem: { fontSize: 20, fontWeight: "bold", color: "#9BA1A6" },
  logoStore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 6,
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  recentSection: { marginBottom: 12 },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentTitle: { fontSize: 14, color: "#9BA1A6" },
  clearText: { fontSize: 14, color: "#9BA1A6" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 8 },
  chip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: "#2C1810" },
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
  hintRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  hintText: { color: "#9BA1A6", marginLeft: 6 },
});
