import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleConfirm = () => {
    // TODO: Implement password reset logic
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('New password:', { newPassword, confirmPassword });
    // Navigate to login screen
    router.push('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Create new password
            </ThemedText>
          </View>

          {/* Instructions */}
          <ThemedText style={styles.instructions}>
            Your new password must be different from previously used password
          </ThemedText>

          {/* Password Inputs */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#9BA1A6"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showNewPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9BA1A6"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9BA1A6"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9BA1A6"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputLine} />
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 38,
  },
  instructions: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

