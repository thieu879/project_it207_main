import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile";

export default function ProfileSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.gender || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const serverUser = await profileService.fetchProfile();
        if (serverUser) {
          setFormData({
            firstName: serverUser.firstName || "",
            lastName: serverUser.lastName || "",
            email: serverUser.email || "",
            gender: serverUser.gender || "",
            phone: serverUser.phone || "",
          });
          updateUserInfo(serverUser as any);
        }
      } catch (err) {
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        phone: formData.phone,
      };

      const updatedUser = await profileService.updateProfile(payload);
      updateUserInfo(updatedUser);
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to view settings</Text>
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
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Setting</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={40} color="#9BA1A6" />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={async () => {
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

                    const imageUrl = await profileService.updateAvatar(formData);
                    updateUserInfo({ ...user, imageUrl });
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
              }}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, firstName: text })
                }
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, lastName: text })
                }
              />
            </View>
          </View>

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text: string) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="Gender"
                value={formData.gender}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, gender: text })
                }
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Phone"
                value={formData.phone}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Button
            title="Save change"
            onPress={handleUpdateProfile}
            loading={loading}
            style={styles.saveButton}
          />
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
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFB6C1",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C1810",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  form: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    marginRight: 12,
  },
  saveButton: {
    marginTop: 30,
    borderRadius: 28,
    alignSelf: "center",
    width: "60%",
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

