import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/order';
import { useAuth } from '@/hooks/useAuth';
import { addressService } from '@/services/address';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { items, total, isLoading, fetchCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState<'app' | 'cod'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [copyBillingAddress, setCopyBillingAddress] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Load user data and addresses
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setAddress(defaultAddress.fullAddress);
        setCountry(defaultAddress.addressType === 'office' ? 'Office' : 'Home');
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const shippingMethods = [
    {
      id: 'free',
      name: 'Free Delivery to home',
      price: 0,
      description: 'Delivery from 3 to 7 business days',
    },
    {
      id: 'standard',
      name: '$ 9.90 Delivery to home',
      price: 9.9,
      description: 'Delivery from 4 to 6 business days',
    },
    {
      id: 'fast',
      name: '$ 9.90 Fast Delivery',
      price: 9.9,
      description: 'Delivery from 2 to 3 business days',
    },
  ];

  const handleContinueToPayment = () => {
    if (!firstName || !lastName || !country || !address || !phoneNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Please login to place an order');
      router.push('/(auth)/login');
      return;
    }

    if (paymentMethod === 'app') {
      Alert.alert('Coming Soon', 'Payment via app feature will be available soon');
      return;
    }

    try {
      Alert.alert(
        'Confirm Order',
        `Total: $${finalTotal.toFixed(2)}\n\nPayment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Payment via App'}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
                await orderService.createOrder();
                await fetchCart();
                router.push('/');
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to create order');
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to checkout</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
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

  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const finalTotal = total + shippingCost;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, currentStep >= 1 && styles.progressIconActive]}>
            <Ionicons
              name="location"
              size={20}
              color={currentStep >= 1 ? '#FFFFFF' : '#9BA1A6'}
            />
          </View>
          <Text style={[styles.progressLabel, currentStep >= 1 && styles.progressLabelActive]}>
            Shipping
          </Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, currentStep >= 2 && styles.progressIconActive]}>
            <Ionicons name="card" size={20} color={currentStep >= 2 ? '#FFFFFF' : '#9BA1A6'} />
          </View>
          <Text style={[styles.progressLabel, currentStep >= 2 && styles.progressLabelActive]}>
            Payment
          </Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, currentStep >= 3 && styles.progressIconActive]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={currentStep >= 3 ? '#FFFFFF' : '#9BA1A6'}
            />
          </View>
          <Text style={[styles.progressLabel, currentStep >= 3 && styles.progressLabelActive]}>
            Review
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {currentStep === 1 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>STEP 1</Text>
              <Text style={styles.sectionTitle}>Shipping</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#9BA1A6"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last name *</Text>
                <TextInput
                  style={[styles.input, !lastName && styles.inputError]}
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#9BA1A6"
                />
                {!lastName && <Text style={styles.errorText}>Field is required</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Country *</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select country"
                    value={country}
                    onChangeText={setCountry}
                    placeholderTextColor="#9BA1A6"
                  />
                  <Ionicons name="chevron-down" size={20} color="#9BA1A6" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full address"
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor="#9BA1A6"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9BA1A6"
                />
              </View>
            </View>

            <View style={styles.shippingMethodSection}>
              <Text style={styles.sectionTitle}>Shipping method</Text>
              {shippingMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.shippingMethodOption}
                  onPress={() => setShippingMethod(method.id)}>
                  <View
                    style={[
                      styles.radioButton,
                      shippingMethod === method.id && styles.radioButtonSelected,
                    ]}>
                    {shippingMethod === method.id && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={styles.shippingMethodInfo}>
                    <Text style={styles.shippingMethodName}>{method.name}</Text>
                    <Text style={styles.shippingMethodDescription}>{method.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.couponSection}>
              <Text style={styles.sectionTitle}>Coupon Code</Text>
              <View style={styles.couponInputContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Have a code? type it here..."
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholderTextColor="#9BA1A6"
                />
                <TouchableOpacity style={styles.validateButton}>
                  <Text style={styles.validateButtonText}>Validate</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.billingSection}>
              <Text style={styles.sectionTitle}>Billing Address</Text>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setCopyBillingAddress(!copyBillingAddress)}>
                <View
                  style={[
                    styles.checkbox,
                    copyBillingAddress && styles.checkboxChecked,
                  ]}>
                  {copyBillingAddress && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Copy address data from shipping</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>STEP 2</Text>
              <Text style={styles.sectionTitle}>Payment</Text>
            </View>
            
            <View style={styles.paymentMethodSection}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              
              <TouchableOpacity
                style={styles.paymentMethodOption}
                onPress={() => setPaymentMethod('cod')}>
                <View
                  style={[
                    styles.radioButton,
                    paymentMethod === 'cod' && styles.radioButtonSelected,
                  ]}>
                  {paymentMethod === 'cod' && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Ionicons name="cash-outline" size={24} color="#2C1810" />
                  <View style={styles.paymentMethodTextContainer}>
                    <Text style={styles.paymentMethodName}>Cash on Delivery</Text>
                    <Text style={styles.paymentMethodDescription}>
                      Pay when you receive the order
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentMethodOption}
                onPress={() => {
                  setPaymentMethod('app');
                  Alert.alert('Coming Soon', 'Payment via app feature will be available soon');
                }}>
                <View
                  style={[
                    styles.radioButton,
                    paymentMethod === 'app' && styles.radioButtonSelected,
                  ]}>
                  {paymentMethod === 'app' && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Ionicons name="card-outline" size={24} color="#2C1810" />
                  <View style={styles.paymentMethodTextContainer}>
                    <Text style={styles.paymentMethodName}>Payment via App</Text>
                    <Text style={styles.paymentMethodDescription}>
                      Pay securely through the app
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {paymentMethod === 'app' && (
                <View style={styles.comingSoonBanner}>
                  <Ionicons name="information-circle-outline" size={20} color="#FFA500" />
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>STEP 3</Text>
              <Text style={styles.sectionTitle}>Review</Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Order Items</Text>
              {items.map((item) => (
                <View key={item.productId} style={styles.reviewItem}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.reviewItemImage} />
                  ) : (
                    <View style={[styles.reviewItemImage, styles.placeholderImage]}>
                      <Ionicons name="image-outline" size={24} color="#9BA1A6" />
                    </View>
                  )}
                  <View style={styles.reviewItemInfo}>
                    <Text style={styles.reviewItemName}>{item.productName}</Text>
                    <Text style={styles.reviewItemQuantity}>Quantity: {item.quantity}</Text>
                  </View>
                  <Text style={styles.reviewItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Shipping Information</Text>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Name:</Text>
                <Text style={styles.reviewInfoValue}>
                  {firstName} {lastName}
                </Text>
              </View>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Phone:</Text>
                <Text style={styles.reviewInfoValue}>{phoneNumber}</Text>
              </View>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Address:</Text>
                <Text style={styles.reviewInfoValue}>{address}</Text>
              </View>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Country:</Text>
                <Text style={styles.reviewInfoValue}>{country}</Text>
              </View>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Payment Information</Text>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Payment Method:</Text>
                <Text style={styles.reviewInfoValue}>
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Payment via App'}
                </Text>
              </View>
              <View style={styles.reviewInfoRow}>
                <Text style={styles.reviewInfoLabel}>Shipping Method:</Text>
                <Text style={styles.reviewInfoValue}>
                  {shippingMethods.find((m) => m.id === shippingMethod)?.name || 'Free Delivery'}
                </Text>
              </View>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>
                  ${(shippingMethods.find((m) => m.id === shippingMethod)?.price || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelBold}>Total:</Text>
                <Text style={styles.summaryValueBold}>
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        {currentStep === 1 && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueToPayment}>
            <Text style={styles.continueButtonText}>Continue to payment</Text>
          </TouchableOpacity>
        )}
        {currentStep === 2 && (
          <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentStep(3)}>
            <Text style={styles.continueButtonText}>Review Order</Text>
          </TouchableOpacity>
        )}
        {currentStep === 3 && (
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={isLoading}>
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Processing...' : 'Place Order'}
            </Text>
          </TouchableOpacity>
        )}
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressIconActive: {
    backgroundColor: '#2C1810',
  },
  progressLabel: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  progressLabelActive: {
    color: '#000000',
    fontWeight: '600',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
    marginBottom: 20,
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
  sectionHeader: {
    marginBottom: 20,
  },
  sectionNumber: {
    fontSize: 12,
    color: '#9BA1A6',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
  },
  shippingMethodSection: {
    marginBottom: 30,
  },
  shippingMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9BA1A6',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  shippingMethodInfo: {
    flex: 1,
  },
  shippingMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  shippingMethodDescription: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  couponSection: {
    marginBottom: 30,
  },
  couponInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  validateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
  },
  validateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  billingSection: {
    marginBottom: 30,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9BA1A6',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2C1810',
    borderColor: '#2C1810',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000000',
  },
  paymentSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentText: {
    fontSize: 14,
    color: '#9BA1A6',
    textAlign: 'center',
  },
  paymentMethodSection: {
    marginBottom: 30,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentMethodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    gap: 12,
  },
  paymentMethodTextContainer: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
  },
  reviewSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  reviewItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewItemInfo: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  reviewItemQuantity: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  reviewItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  reviewInfoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewInfoLabel: {
    fontSize: 14,
    color: '#9BA1A6',
    width: 100,
  },
  reviewInfoValue: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  summaryValue: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 10,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    padding: 20,
    paddingTop: 15,
  },
  continueButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});





