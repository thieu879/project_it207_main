import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile-image.jpg",
        } as any);

        await profileService.updateAvatar(formData);
        Alert.alert("Success", "Profile picture updated successfully");
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to update profile picture"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to view profile</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username || "User";

  const menuItems = [
    {
      id: "address",
      label: "Address",
      icon: "location-outline",
      onPress: () => router.push("/profile/address"),
    },
    {
      id: "payment",
      label: "Payment method",
      icon: "card-outline",
      onPress: () => {
        Alert.alert("Coming Soon", "Payment method feature will be available soon");
      },
    },
    {
      id: "voucher",
      label: "Voucher",
      icon: "pricetag-outline",
      onPress: () => {
        Alert.alert(
          "Coming Soon",
          "Payment method feature will be available soon"
        );
      },
    },
    {
      id: "wishlist",
      label: "My Wishlist",
      icon: "heart-outline",
      onPress: () => router.push("/profile/wishlist"),
    },
    {
      id: "rate",
      label: "Rate this app",
      icon: "star-outline",
      onPress: () => {
        Alert.alert(
          "Coming Soon",
          "Payment method feature will be available soon"
        );
      },
    },
    {
      id: "logout",
      label: "Log out",
      icon: "log-out-outline",
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.avatarContainer}>
            <Image
              source={
                user.imageUrl
                  ? { uri: user.imageUrl }
                  : {
                      uri:
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(fullName) +
                        "&background=FFB6C1&color=fff",
                    }
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{user.email || ""}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile/settings")}
            style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.isDestructive ? "#FF3B30" : "#000000"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    item.isDestructive && styles.menuItemTextDestructive,
                  ]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9BA1A6"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFB6C1",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  settingsButton: {
    padding: 8,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F5F5F5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 16,
    fontWeight: "400",
  },
  menuItemTextDestructive: {
    color: "#FF3B30",
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
