import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { orderService, OrderDetail, OrderStatus } from "@/services/order";
import { useAuth } from "@/hooks/useAuth";

type OrderTab = "pending" | "delivered" | "cancelled";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderTab>("pending");
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStatus = (order: OrderDetail): OrderStatus => {
    if (!order.trackingHistory || order.trackingHistory.length === 0) {
      return "PENDING";
    }
    const latestTracking = order.trackingHistory.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return (latestTracking.status.toUpperCase() as OrderStatus) || "PENDING";
  };

  const getTrackingNumber = (order: OrderDetail): string => {
    return `IK${order.id.toString().padStart(10, "0")}`;
  };

  const getTotalQuantity = (order: OrderDetail): number => {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "#FF9500";
      case "DELIVERED":
        return "#4CAF50";
      case "CANCELLED":
        return "#FF3B30";
      default:
        return "#9BA1A6";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status = getOrderStatus(order);
    switch (activeTab) {
      case "pending":
        return status === "PENDING" || status === "PROCESSING" || status === "SHIPPED";
      case "delivered":
        return status === "DELIVERED";
      case "cancelled":
        return status === "CANCELLED";
      default:
        return true;
    }
  });

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to view orders</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={24} color="#000000" />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.tabActive]}
          onPress={() => setActiveTab("pending")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.tabTextActive,
            ]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "delivered" && styles.tabActive]}
          onPress={() => setActiveTab("delivered")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "delivered" && styles.tabTextActive,
            ]}>
            Delivered
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "cancelled" && styles.tabActive]}
          onPress={() => setActiveTab("cancelled")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "cancelled" && styles.tabTextActive,
            ]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C1810" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#9BA1A6" />
          <Text style={styles.emptyText}>
            {activeTab === "pending"
              ? "No pending orders"
              : activeTab === "delivered"
              ? "No delivered orders"
              : "No cancelled orders"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchOrders} />
          }>
          {filteredOrders.map((order) => {
            const status = getOrderStatus(order);
            const statusColor = getStatusColor(status);
            const trackingNumber = getTrackingNumber(order);
            const quantity = getTotalQuantity(order);

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <Text style={styles.orderNumber}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                </View>

                <Text style={styles.trackingNumber}>
                  Tracking number: {trackingNumber}
                </Text>

                <View style={styles.orderInfoRow}>
                  <Text style={styles.quantityText}>Quantity: {quantity}</Text>
                  <Text style={styles.subtotalText}>
                    Subtotal: ${order.totalAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.orderCardFooter}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {status}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push(`/order/${order.id}`)}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
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
  scrollContent: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9BA1A6",
    marginTop: 16,
    textAlign: "center",
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
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  orderDate: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  trackingNumber: {
    fontSize: 12,
    color: "#9BA1A6",
    marginBottom: 12,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityText: {
    fontSize: 14,
    color: "#000000",
  },
  subtotalText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
  orderCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2C1810",
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C1810",
  },
});

