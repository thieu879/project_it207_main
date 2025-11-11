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
import { router, useLocalSearchParams } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addressService, AddressRequest, Address } from "@/services/address";
import { useAuth } from "@/hooks/useAuth";

export default function EditAddressScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  const addressId = params.id ? parseInt(params.id as string) : null;

  const [formData, setFormData] = useState<AddressRequest>({
    label: "",
    fullAddress: "",
    addressType: "home",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (addressId && isAuthenticated) {
      fetchAddress();
    }
  }, [addressId, isAuthenticated]);

  const fetchAddress = async () => {
    if (!addressId) return;
    try {
      setFetching(true);
      const address = await addressService.getAddressById(addressId);
      setFormData({
        label: address.label,
        fullAddress: address.fullAddress,
        addressType: address.addressType || "home",
        isDefault: address.isDefault || false,
      });
    } catch (error: any) {
      Alert.alert("Error", "Failed to load address");
      router.back();
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.label.trim() || !formData.fullAddress.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!addressId) return;

    try {
      setLoading(true);
      await addressService.updateAddress(addressId, formData);
      Alert.alert("Success", "Address updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update address"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to edit address</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (fetching) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C1810" />
        </View>
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
        <Text style={styles.headerTitle}>Edit address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Input
          label="Label *"
          placeholder="e.g., My Home, My Office"
          value={formData.label}
          onChangeText={(text) => setFormData({ ...formData, label: text })}
        />

        <Input
          label="Full Address *"
          placeholder="Enter your full address"
          value={formData.fullAddress}
          onChangeText={(text) =>
            setFormData({ ...formData, fullAddress: text })
          }
          multiline
          numberOfLines={4}
        />

        <View style={styles.typeContainer}>
          <Text style={styles.typeLabel}>Address Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.addressType === "home" && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, addressType: "home" })}>
              <Ionicons
                name="home"
                size={20}
                color={formData.addressType === "home" ? "#FFFFFF" : "#2C1810"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.addressType === "home" &&
                    styles.typeButtonTextActive,
                ]}>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.addressType === "office" && styles.typeButtonActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, addressType: "office" })
              }>
              <Ionicons
                name="business"
                size={20}
                color={
                  formData.addressType === "office" ? "#FFFFFF" : "#2C1810"
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.addressType === "office" &&
                    styles.typeButtonTextActive,
                ]}>
                Office
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() =>
            setFormData({ ...formData, isDefault: !formData.isDefault })
          }>
          <View
            style={[
              styles.checkbox,
              formData.isDefault && styles.checkboxChecked,
            ]}>
            {formData.isDefault && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </TouchableOpacity>

        <Button
          title="Update Address"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
        />
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  typeContainer: {
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: "#2C1810",
    borderColor: "#2C1810",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C1810",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9BA1A6",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2C1810",
    borderColor: "#2C1810",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000000",
  },
  saveButton: {
    marginTop: 10,
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

