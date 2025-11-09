import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, active = false }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = active ? (colorScheme === 'dark' ? '#2C2C2C' : '#F5F5F5') : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Ionicons
        name={icon}
        size={24}
        color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'}
        style={styles.menuIcon}
      />
      <ThemedText style={styles.menuLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

export const Drawer: React.FC<DrawerProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.container}>
        {/* Overlay - chỉ phần bên phải có thể click */}
        <View style={styles.overlayContainer}>
          <View style={styles.overlayLeft} />
          <TouchableOpacity
            style={styles.overlayRight}
            activeOpacity={1}
            onPress={onClose}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: colorScheme === 'dark' ? '#151718' : '#FFFFFF',
            },
          ]}>
          <View style={styles.drawerContent}>
            {/* User Profile Section */}
            <View style={styles.profileSection}>
              <View style={[styles.avatar, { backgroundColor: '#FFB6C1' }]}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.userName}>
                {user?.username || user?.email || 'Guest User'}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email || 'guest@example.com'}
              </ThemedText>
            </View>

            {/* Main Navigation */}
            <View style={styles.menuSection}>
              <MenuItem
                icon="home"
                label="Homepage"
                onPress={() => handleNavigation('/(tabs)')}
                active
              />
              <MenuItem
                icon="search"
                label="Discover"
                onPress={() => handleNavigation('/(tabs)')}
              />
              <MenuItem
                icon="bag"
                label="My Order"
                onPress={() => handleNavigation('/orders')}
              />
              <MenuItem
                icon="person"
                label="My profile"
                onPress={() => handleNavigation('/(tabs)')}
              />
            </View>

            {/* Other Section */}
            <View style={styles.otherSection}>
              <ThemedText style={styles.sectionLabel}>OTHER</ThemedText>
              <MenuItem
                icon="settings"
                label="Setting"
                onPress={() => handleNavigation('/(tabs)')}
              />
              <MenuItem
                icon="mail"
                label="Support"
                onPress={() => handleNavigation('/(tabs)')}
              />
              <MenuItem
                icon="information-circle"
                label="About us"
                onPress={() => handleNavigation('/(tabs)')}
              />
            </View>

            {/* Theme Toggle */}
            <View style={styles.themeSection}>
              <View style={styles.themeToggle}>
                <View
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: colorScheme === 'light' ? '#F5F5F5' : 'transparent',
                    },
                  ]}>
                  <Ionicons
                    name="sunny"
                    size={20}
                    color={colorScheme === 'light' ? '#11181C' : '#9BA1A6'}
                  />
                  <ThemedText
                    style={[
                      styles.themeOptionText,
                      { color: colorScheme === 'light' ? '#11181C' : '#9BA1A6' },
                    ]}>
                    Light
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#F5F5F5' : 'transparent',
                    },
                  ]}>
                  <Ionicons
                    name="moon"
                    size={20}
                    color={colorScheme === 'dark' ? '#11181C' : '#9BA1A6'}
                  />
                  <ThemedText
                    style={[
                      styles.themeOptionText,
                      { color: colorScheme === 'dark' ? '#11181C' : '#9BA1A6' },
                    ]}>
                    Dark
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  overlayLeft: {
    width: DRAWER_WIDTH,
  },
  overlayRight: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    zIndex: 1000,
  },
  drawerContent: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
  },
  otherSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    paddingHorizontal: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  themeSection: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  themeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

