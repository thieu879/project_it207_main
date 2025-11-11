import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { Drawer } from '@/components/Drawer';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { products, fetchProducts, isLoading } = useProducts();
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    // Only fetch once on mount
    fetchProducts({ page: 0, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { id: 1, name: 'Women', icon: 'woman', color: '#F5F5F5' },
    { id: 2, name: 'Men', icon: 'man', color: '#F5F5F5' },
    { id: 3, name: 'Accessories', icon: 'glasses', color: '#F5F5F5' },
    { id: 4, name: 'Beauty', icon: 'sparkles', color: '#F5F5F5' },
  ];

  const featuredProducts = products.slice(0, 3);
  const recommendedProducts = products.slice(3, 5);

  const renderProductCard = (product: Product, index: number) => (
    <TouchableOpacity key={product.id} style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={40} color="#9BA1A6" />
          </View>
        )}
      </View>
      <Text style={styles.productName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const renderBanner = (title: string, subtitle: string, imageUrl?: string, style?: any) => (
    <TouchableOpacity style={[styles.banner, style]}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerSubtitle}>{title}</Text>
        <Text style={styles.bannerTitle}>{subtitle}</Text>
      </View>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.bannerImage} />
      ) : (
        <View style={[styles.bannerImage, styles.placeholderBanner]}>
          <Ionicons name="image-outline" size={60} color="#9BA1A6" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoGem}>Gem</Text>
          <Text style={styles.logoStore}>Store</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Category Icons */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={24} color="#2C1810" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Banner */}
        {renderBanner(
          'Autumn Collection 2021',
          '',
          undefined,
          styles.mainBanner
        )}

        {/* Feature Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feature Products</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}>
            {isLoading && featuredProducts.length === 0 ? (
              <Text style={styles.loadingText}>Loading products...</Text>
            ) : (
              featuredProducts.map((product, index) => renderProductCard(product, index))
            )}
          </ScrollView>
        </View>

        {/* New Collection Banner */}
        {renderBanner('NEW COLLECTION', 'HANG OUT & PARTY', undefined, styles.collectionBanner)}

        {/* Recommended Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}>
            {recommendedProducts.map((product, index) => renderProductCard(product, index))}
          </ScrollView>
        </View>

        {/* Top Collection Banner */}
        {renderBanner('Sale up to 40%', 'FOR SLIM & BEAUTY', undefined, styles.collectionBanner)}

        {/* Summer Collection Banner */}
        {renderBanner(
          'Summer Collection 2021',
          'Most sexy & fabulous design',
          undefined,
          styles.collectionBanner
        )}

        {/* Product Categories */}
        <View style={styles.section}>
          <View style={styles.categoryCardRow}>
            <TouchableOpacity style={styles.categoryCard}>
              <View style={styles.categoryCardImageContainer}>
                <View style={[styles.categoryCardImage, styles.placeholderImage]}>
                  <Ionicons name="shirt-outline" size={40} color="#9BA1A6" />
                </View>
              </View>
              <View style={styles.categoryCardContent}>
                <Text style={styles.categoryCardTitle}>T-Shirts</Text>
                <Text style={styles.categoryCardSubtitle}>The Office Life</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={styles.categoryCardImageContainer}>
                <View style={[styles.categoryCardImage, styles.placeholderImage]}>
                  <Ionicons name="shirt-outline" size={40} color="#9BA1A6" />
                </View>
              </View>
              <View style={styles.categoryCardContent}>
                <Text style={styles.categoryCardTitle}>Dresses</Text>
                <Text style={styles.categoryCardSubtitle}>Elegant Design</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGem: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9BA1A6',
  },
  logoStore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  mainBanner: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: '#E8D5C4',
    overflow: 'hidden',
  },
  banner: {
    flexDirection: 'row',
    height: 150,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    padding: 20,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#9BA1A6',
    marginBottom: 8,
    fontWeight: '500',
  },
  bannerTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 120,
    height: '100%',
    borderRadius: 8,
  },
  placeholderBanner: {
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionBanner: {
    height: 150,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  showAll: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  productsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  productCard: {
    width: 150,
    marginRight: 15,
  },
  productImageContainer: {
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  categoryCardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  categoryCardImageContainer: {
    marginRight: 12,
  },
  categoryCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  categoryCardContent: {
    flex: 1,
  },
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  categoryCardSubtitle: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  loadingText: {
    textAlign: 'center',
    color: '#9BA1A6',
    padding: 20,
  },
});
