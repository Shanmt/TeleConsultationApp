import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={inputStyle}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textLight}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  leftIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    zIndex: 1,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
});
