import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password || password !== confirmPassword) return;
    await signUp({ username: name, email, password });
    router.replace('/');
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
              Create
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              your account
            </ThemedText>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9BA1A6"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.inputLine} />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9BA1A6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputLine} />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9BA1A6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.inputLine} />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#9BA1A6"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <View style={styles.inputLine} />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
            <ThemedText style={styles.signUpButtonText}>{isLoading ? '...' : 'SIGN UP'}</ThemedText>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <ThemedText style={styles.orText}>or sign up with</ThemedText>
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

          <View style={styles.loginLinkContainer}>
            <ThemedText style={styles.loginText}>Already have account? </ThemedText>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.loginLink}>Log In</ThemedText>
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
  input: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 24,
  },
  signUpButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#000000',
  },
  loginLink: {
    fontSize: 14,
    color: '#000000',
    textDecorationLine: 'underline',
  },
});

