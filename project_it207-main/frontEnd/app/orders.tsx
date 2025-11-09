import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { orderService, OrderDetail } from '@/services/order';
import { useAuth } from '@/hooks/useAuth';
import { Drawer } from '@/components/Drawer';

type OrderStatus = 'PENDING' | 'DELIVERED' | 'CANCELLED';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>([]);
  const [selectedTab, setSelectedTab] = useState<OrderStatus>('PENDING');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedTab]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedTab === 'CANCELLED') {
      // Filter cancelled orders (status contains CANCELLED or CANCEL)
      setFilteredOrders(
        orders.filter((order) => {
          const latestStatus = order.trackingHistory[order.trackingHistory.length - 1]?.status;
          return latestStatus?.toUpperCase().includes('CANCEL');
        })
      );
    } else {
      // Filter by status
      setFilteredOrders(
        orders.filter((order) => {
          const latestStatus = order.trackingHistory[order.trackingHistory.length - 1]?.status;
          return latestStatus?.toUpperCase() === selectedTab;
        })
      );
    }
  };

  const getOrderStatus = (order: OrderDetail): string => {
    if (order.trackingHistory.length === 0) return 'PENDING';
    const latestStatus = order.trackingHistory[order.trackingHistory.length - 1]?.status;
    return latestStatus || 'PENDING';
  };

  const getStatusColor = (status: string): string => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('DELIVERED')) return '#4CAF50';
    if (statusUpper.includes('CANCEL')) return '#FF3B30';
    return '#FF9500'; // PENDING
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const generateTrackingNumber = (orderId: number): string => {
    return `IK${orderId.toString().padStart(10, '0')}`;
  };

  const getTotalQuantity = (order: OrderDetail): number => {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderOrderItem = ({ item }: { item: OrderDetail }) => {
    const status = getOrderStatus(item);
    const statusColor = getStatusColor(status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>
        <Text style={styles.trackingNumber}>
          Tracking number: {generateTrackingNumber(item.id)}
        </Text>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfo}>Quantity: {getTotalQuantity(item)}</Text>
          <Text style={styles.orderSubtotal}>Subtotal: ${item.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.orderFooter}>
          <Text style={[styles.orderStatus, { color: statusColor }]}>
            {status.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => router.push(`/order/${item.id}`)}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to view your orders</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#000000" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'PENDING' && styles.tabActive]}
          onPress={() => setSelectedTab('PENDING')}>
          <Text style={[styles.tabText, selectedTab === 'PENDING' && styles.tabTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'DELIVERED' && styles.tabActive]}
          onPress={() => setSelectedTab('DELIVERED')}>
          <Text style={[styles.tabText, selectedTab === 'DELIVERED' && styles.tabTextActive]}>
            Delivered
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'CANCELLED' && styles.tabActive]}
          onPress={() => setSelectedTab('CANCELLED')}>
          <Text style={[styles.tabText, selectedTab === 'CANCELLED' && styles.tabTextActive]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#9BA1A6" />
          <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} orders</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#2C1810',
  },
  tabText: {
    fontSize: 14,
    color: '#9BA1A6',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  orderDate: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  trackingNumber: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 10,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  orderSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9BA1A6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9BA1A6',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

