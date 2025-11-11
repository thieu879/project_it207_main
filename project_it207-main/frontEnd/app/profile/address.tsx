import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { addressService, Address } from "@/services/address";
import { useAuth } from "@/hooks/useAuth";

export default function AddressScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      Alert.alert("Error", "Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      setSelectedAddressId(id);
      await fetchAddresses();
    } catch (error: any) {
      console.error("Failed to set default address:", error);
      Alert.alert("Error", "Failed to set default address");
    }
  };

  const handleEditAddress = (address: Address) => {
    router.push({
      pathname: "/profile/address/edit",
      params: { id: address.id.toString() },
    });
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${address.label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await addressService.deleteAddress(address.id);
              await fetchAddresses();
              Alert.alert("Success", "Address deleted successfully");
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  const handleAddNewAddress = () => {
    router.push("/profile/address/add");
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to view addresses</Text>
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
        <Text style={styles.headerTitle}>Delivery address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {isLoading && addresses.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C1810" />
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color="#9BA1A6" />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <Text style={styles.emptySubtext}>
              Add a new address to get started
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressCardLeft}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleSelectAddress(address.id)}>
                  {selectedAddressId === address.id ||
                  address.isDefault ? (
                    <View style={styles.radioButtonSelected}>
                      <View style={styles.radioButtonInner} />
                    </View>
                  ) : (
                    <View style={styles.radioButtonUnselected} />
                  )}
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                  <Ionicons
                    name={
                      address.addressType === "office"
                        ? "business"
                        : "home"
                    }
                    size={24}
                    color="#2C1810"
                  />
                </View>

                <View style={styles.addressInfo}>
                  <Text style={styles.sendToLabel}>SEND TO</Text>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  <Text style={styles.addressText}>
                    {address.fullAddress}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAddress(address)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAddress(address)}>
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}>
          <Text style={styles.addButtonText}>Add new address</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  addressCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    marginRight: 16,
  },
  radioButtonSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2C1810",
    backgroundColor: "#2C1810",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  radioButtonUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9BA1A6",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  sendToLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9BA1A6",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#9BA1A6",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9BA1A6",
    marginTop: 8,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#2C1810",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#9BA1A6",
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#2C1810",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

