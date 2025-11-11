import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { orderService, OrderDetail } from '@/services/order';

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(Number(id));
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await orderService.cancelOrder(order.id);
            Alert.alert('Success', 'Order cancelled successfully', [
              { text: 'OK', onPress: () => router.push('/order') }
            ]);
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to cancel order');
          }
        },
      },
    ]);
  };

  const getOrderStatus = (): string => {
    if (!order || order.trackingHistory.length === 0) return 'PENDING';
    const latestStatus = order.trackingHistory[order.trackingHistory.length - 1]?.status;
    return latestStatus || 'PENDING';
  };

  const getStatusColor = (status: string): string => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('DELIVERED')) return '#4CAF50';
    if (statusUpper.includes('CANCEL')) return '#FF3B30';
    return '#FF9500';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading || !order) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  const status = getOrderStatus();
  const statusColor = getStatusColor(status);
  const canCancel = status === 'PENDING';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.push("/order")}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.orderInfoCard}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <Text style={styles.orderValue}>#{order.id}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderLabel}>Order Date</Text>
            <Text style={styles.orderValue}>{formatDate(order.orderDate)}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderLabel}>Status</Text>
            <Text style={[styles.orderStatus, { color: statusColor }]}>
              {status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderLabel}>Total Amount</Text>
            <Text style={styles.orderTotal}>${order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {order.trackingHistory.length > 0 && (
          <View style={styles.trackingSection}>
            <Text style={styles.sectionTitle}>Tracking History</Text>
            {order.trackingHistory.map((tracking, index) => (
              <View key={index} style={styles.trackingItem}>
                <View style={styles.trackingIcon}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={getStatusColor(tracking.status)}
                  />
                </View>
                <View style={styles.trackingInfo}>
                  <Text style={styles.trackingStatus}>{tracking.status}</Text>
                  {tracking.location && (
                    <Text style={styles.trackingLocation}>{tracking.location}</Text>
                  )}
                  <Text style={styles.trackingDate}>
                    {formatDate(tracking.timestamp)} {new Date(tracking.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.orderItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.placeholderImage]}>
                  <Ionicons name="image-outline" size={30} color="#9BA1A6" />
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {canCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  orderInfoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderLabel: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  trackingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  trackingItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  trackingIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  trackingLocation: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 4,
  },
  trackingDate: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  itemsSection: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});





