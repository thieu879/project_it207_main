import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '../themed-text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primaryButton, isDisabled && styles.disabled, style];
      case 'secondary':
        return [styles.button, styles.secondaryButton, isDisabled && styles.disabled, style];
      case 'outline':
        return [styles.button, styles.outlineButton, isDisabled && styles.disabled, style];
      default:
        return [styles.button, styles.primaryButton, isDisabled && styles.disabled, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.primaryText, textStyle];
      case 'secondary':
        return [styles.secondaryText, textStyle];
      case 'outline':
        return [styles.outlineText, textStyle];
      default:
        return [styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#2C1810'} />
      ) : (
        <ThemedText style={getTextStyle()}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#2C1810',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2C1810',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  secondaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: '600',
  },
});





