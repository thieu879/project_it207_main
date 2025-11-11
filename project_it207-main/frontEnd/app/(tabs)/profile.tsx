import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile";

export default function ProfileScreen() {
  const { user, logout, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load latest profile from server if available
    const load = async () => {
      try {
        const serverUser = await profileService.fetchProfile();
        if (serverUser) {
          setFormData((f) => ({
            ...f,
            firstName: serverUser.firstName || f.firstName,
            lastName: serverUser.lastName || f.lastName,
            email: serverUser.email || f.email,
            gender: serverUser.gender || f.gender,
            phone: serverUser.phone || f.phone,
          }));
          // also update store
          updateUserInfo(serverUser as any);
        }
      } catch (err) {
        // ignore - keep local values
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

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

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        payload.currentPassword = formData.currentPassword;
        payload.password = formData.newPassword;
      }

      const updatedUser = await profileService.updateProfile(payload);
      updateUserInfo(updatedUser);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
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

        const imageUrl = await profileService.updateAvatar(formData);
        updateUserInfo({ ...user!, imageUrl });
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
      <ThemedView style={styles.container}>
        <ThemedText>Please login to view profile</ThemedText>
        <Button title="Login" onPress={() => router.push("/(auth)/login")} />
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">Profile Setting</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ThemedView style={styles.headerCenter}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              user.imageUrl
                ? { uri: user.imageUrl }
                : {
                    uri:
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.username),
                  }
            }
            style={styles.avatarLarge}
          />
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.form}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(t: string) =>
                setFormData({ ...formData, firstName: t })
              }
            />
          </View>
          <View style={styles.col}>
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(t: string) =>
                setFormData({ ...formData, lastName: t })
              }
            />
          </View>
        </View>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(t: string) => setFormData({ ...formData, email: t })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Input
              label="Gender"
              value={formData.gender}
              onChangeText={(t: string) =>
                setFormData({ ...formData, gender: t })
              }
            />
          </View>
          <View style={styles.col}>
            <Input
              label="Phone"
              value={formData.phone}
              onChangeText={(t: string) =>
                setFormData({ ...formData, phone: t })
              }
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Button
          title="Save change"
          onPress={handleUpdateProfile}
          loading={loading}
          style={styles.saveBtn}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  headerCenter: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F2F2F2",
  },
  cameraBtn: {
    position: "absolute",
    right: -4,
    bottom: -4,
    backgroundColor: "#2C1810",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  changePhotoText: {
    fontSize: 14,
    textAlign: "center",
    color: "#007AFF",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    marginRight: 12,
  },
  saveBtn: {
    marginTop: 20,
    borderRadius: 28,
    alignSelf: "center",
    width: "60%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  label: {
    fontWeight: "500",
  },
  button: {
    marginTop: 10,
  },
});


