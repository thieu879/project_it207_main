import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { wishlistService, WishlistItem } from "@/services/wishlist";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 40 - CARD_MARGIN) / 2;

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "boards">("all");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load wishlist"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number, productName: string) => {
    Alert.alert(
      "Remove from Wishlist",
      `Are you sure you want to remove "${productName}" from your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await wishlistService.removeFromWishlist(productId);
              setWishlistItems((prev) =>
                prev.filter((item) => item.product.id !== productId)
              );
            } catch (error: any) {
              console.error("Failed to remove from wishlist:", error);
              Alert.alert("Error", "Failed to remove item from wishlist");
            }
          },
        },
      ]
    );
  };

  const renderProductCard = ({ item }: { item: WishlistItem }) => {
    const product = item.product;
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${product.id}`)}>
        <View style={styles.productImageContainer}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={40} color="#9BA1A6" />
            </View>
          )}
          <TouchableOpacity
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveFromWishlist(product.id, product.name);
            }}>
            <Ionicons name="heart" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>4.0</Text>
          <Text style={styles.reviewCount}>(38)</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to view wishlist</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity>
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={24} color="#000000" />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "all" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("all")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}>
            All items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "boards" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("boards")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "boards" && styles.tabTextActive,
            ]}>
            Boards
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "all" ? (
        isLoading && wishlistItems.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C1810" />
            <Text style={styles.loadingText}>Loading wishlist...</Text>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            renderItem={renderProductCard}
            keyExtractor={(item, index) => {
              const itemId = item?.wishlistId || item?.id;
              if (itemId) {
                return itemId.toString();
              }
              if (item?.product?.id) {
                return `wishlist-${item.product.id}-${index}`;
              }
              return `wishlist-item-${index}`;
            }}
            numColumns={2}
            contentContainerStyle={
              wishlistItems.length === 0
                ? styles.emptyListContainer
                : styles.productsList
            }
            columnWrapperStyle={
              wishlistItems.length > 0 ? styles.columnWrapper : undefined
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color="#9BA1A6" />
                <Text style={styles.emptyText}>Your wishlist is empty</Text>
                <Text style={styles.emptySubtext}>
                  Start adding products you love!
                </Text>
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => router.push("/(tabs)")}>
                  <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
              </View>
            }
            refreshing={isLoading && wishlistItems.length > 0}
            onRefresh={fetchWishlist}
          />
        )
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.boardsContent}>
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={64} color="#9BA1A6" />
            <Text style={styles.emptyText}>Boards feature coming soon</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  notificationBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#2C1810",
    borderColor: "#2C1810",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  productsList: {
    padding: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  productImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C1810",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "500",
  },
  reviewCount: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  boardsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#9BA1A6",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9BA1A6",
    marginTop: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9BA1A6",
    marginTop: 8,
    textAlign: "center",
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: "#2C1810",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#2C1810",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

