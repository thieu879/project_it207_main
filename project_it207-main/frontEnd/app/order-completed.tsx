import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function OrderCompletedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.progressIconCompleted]}>
            <Ionicons name="location" size={20} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.progressLineCompleted} />
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.progressIconCompleted]}>
            <Ionicons name="card" size={20} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.progressLineCompleted} />
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.progressIconCompleted]}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Order Completed</Text>

        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.bagIcon}>
            <Ionicons name="bag" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.checkmarkIcon}>
            <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
          </View>
        </View>

        {/* Message */}
        <Text style={styles.message}>Thank you for your purchase.</Text>
        <Text style={styles.subMessage}>You can view your order in 'My Orders' section.</Text>

        {/* Continue Shopping Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.continueButtonText}>Continue shopping</Text>
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
  },
  progressIconCompleted: {
    backgroundColor: '#2C1810',
  },
  progressLineCompleted: {
    flex: 1,
    height: 2,
    backgroundColor: '#2C1810',
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  bagIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  message: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 40,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#2C1810',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

