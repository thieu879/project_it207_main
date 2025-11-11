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
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await login({ username: email, password });
      router.replace('/(tabs)/home');
    } catch (err: any) {
      // Error is handled by useAuth hook and displayed via error state
      alert(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Log into
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              your account
            </ThemedText>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>Email hoặc Username</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Email hoặc Username"
                placeholderTextColor="#9BA1A6"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.passwordHeader}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <Link href="/(auth)/forgot-password" asChild>
                  <TouchableOpacity>
                    <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9BA1A6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.inputLine} />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin} 
            disabled={isLoading}>
            <ThemedText style={styles.loginButtonText}>
              {isLoading ? 'Đang đăng nhập...' : 'LOG IN'}
            </ThemedText>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <ThemedText style={styles.orText}>or log in with</ThemedText>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-apple" size={24} color="#2C1810" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-google" size={24} color="#4285F4" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpLinkContainer}>
            <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
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
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 38,
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
  input: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000000',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orText: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#000000',
  },
  signUpLink: {
    fontSize: 14,
    color: '#000000',
    textDecorationLine: 'underline',
  },
});

