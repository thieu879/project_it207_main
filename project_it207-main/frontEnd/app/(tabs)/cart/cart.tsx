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
import { router } from 'expo-router';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/services/cart';
import { useAuth } from '@/hooks/useAuth';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, total, isLoading, fetchCart, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(new Set(items.map((item) => item.productId)));
    }
  }, [items]);

  const handleToggleSelect = (productId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      try {
        await removeFromCart(item.productId);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to remove item from cart');
      }
    } else {
      try {
        await updateCartItem(item.productId, newQuantity);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update quantity');
      }
    }
  };

  const handleRemoveItem = async (productId: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFromCart(productId);
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to remove item');
          }
        },
      },
    ]);
  };

  const calculateSubtotal = () => {
    return selectedItems.size > 0
      ? items
          .filter((item) => selectedItems.has(item.productId))
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
      : 0;
  };

  const subtotal = calculateSubtotal();
  const shipping = 0;
  const finalTotal = subtotal + shipping;

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to checkout');
      return;
    }
    router.push('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#9BA1A6" />
          <Text style={styles.emptyText}>Please login to view your cart</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#9BA1A6" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => {
          const isSelected = selectedItems.has(item.productId);
          return (
            <View key={item.productId} style={styles.cartItem}>
              <View style={styles.cartItemLeft}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleToggleSelect(item.productId)}>
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={isSelected ? '#4CAF50' : '#9BA1A6'}
                  />
                </TouchableOpacity>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                ) : (
                  <View style={[styles.productImage, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={30} color="#9BA1A6" />
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productPrice}>$ {item.price.toFixed(2)}</Text>
                  <Text style={styles.productDetails}>Size: L | Color: Cream</Text>
                </View>
              </View>
              <View style={styles.cartItemRight}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.productId)}>
                  <Ionicons name="trash-outline" size={20} color="#9BA1A6" />
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, -1)}>
                    <Ionicons name="remove" size={18} color="#000000" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, 1)}>
                    <Ionicons name="add" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.orderSummary, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product price</Text>
          <Text style={styles.summaryValue}>$ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Freeship</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabelBold}>Subtotal</Text>
          <Text style={styles.summaryValueBold}>$ {finalTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, selectedItems.size === 0 && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={selectedItems.size === 0 || isLoading}>
          <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shopButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  cartItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    marginTop: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  cartItemRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  removeButton: {
    padding: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 5,
    gap: 15,
    minWidth: 100,
    justifyContent: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    minWidth: 20,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    padding: 20,
    paddingTop: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  summaryValue: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#9BA1A6',
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
