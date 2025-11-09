import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { Drawer } from '@/components/Drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Category {
  id: number;
  name: string;
  color: string;
  imageUrl?: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  itemCount: number;
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { products, fetchProducts } = useProducts();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from storage
    loadRecentSearches();
    // Fetch some products for popular section
    fetchProducts({ page: 0, limit: 6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        // Default recent searches
        setRecentSearches(['Sunglasses', 'Sweater', 'Hoodie']);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveSearch = async (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      try {
        await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent search:', error);
      }
    }
  };

  const removeSearch = async (query: string) => {
    const updated = recentSearches.filter((s) => s !== query);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem('recent_searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const handleSearch = (query?: string) => {
    const queryToSearch = query || searchQuery;
    if (queryToSearch.trim()) {
      saveSearch(queryToSearch);
      router.push({
        pathname: '/products',
        params: { search: queryToSearch },
      });
    }
  };

  const handleSearchTagPress = (query: string) => {
    router.push({
      pathname: '/products',
      params: { search: query },
    });
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/products',
      params: { category: categoryName },
    });
  };

  const handleSubCategoryPress = (subCategoryName: string, categoryName: string) => {
    router.push({
      pathname: '/products',
      params: { category: categoryName, subCategory: subCategoryName },
    });
  };

  const categories: Category[] = [
    {
      id: 1,
      name: 'CLOTHING',
      color: '#A8B5A0',
      subCategories: [
        { id: 1, name: 'Jacket', itemCount: 128 },
        { id: 2, name: 'Skirts', itemCount: 40 },
        { id: 3, name: 'Dresses', itemCount: 36 },
        { id: 4, name: 'Sweaters', itemCount: 24 },
        { id: 5, name: 'Jeans', itemCount: 14 },
        { id: 6, name: 'T-Shirts', itemCount: 12 },
        { id: 7, name: 'Pants', itemCount: 9 },
      ],
    },
    {
      id: 2,
      name: 'ACCESSORIES',
      color: '#9BA1A6',
      subCategories: [
        { id: 8, name: 'Bags', itemCount: 45 },
        { id: 9, name: 'Watches', itemCount: 32 },
        { id: 10, name: 'Jewelry', itemCount: 28 },
        { id: 11, name: 'Belts', itemCount: 15 },
      ],
    },
    {
      id: 3,
      name: 'SHOES',
      color: '#5A6B73',
      subCategories: [
        { id: 12, name: 'Sneakers', itemCount: 56 },
        { id: 13, name: 'Heels', itemCount: 42 },
        { id: 14, name: 'Boots', itemCount: 28 },
        { id: 15, name: 'Sandals', itemCount: 18 },
      ],
    },
    {
      id: 4,
      name: 'COLLECTION',
      color: '#B8A9C9',
      subCategories: [
        { id: 16, name: 'Summer', itemCount: 67 },
        { id: 17, name: 'Winter', itemCount: 54 },
        { id: 18, name: 'Spring', itemCount: 43 },
      ],
    },
  ];

  const popularProducts = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#000000" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => router.push({ pathname: '/products', params: { search: '' } })}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9BA1A6" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => router.push({ pathname: '/products', params: { showFilter: 'true' } })}>
            <Ionicons name="options-outline" size={20} color="#000000" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Ionicons name="trash-outline" size={20} color="#9BA1A6" />
              </TouchableOpacity>
            </View>
            <View style={styles.recentSearchesTags}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchTag}
                  onPress={() => handleSearchTagPress(search)}>
                  <Text style={styles.searchTagText}>{search}</Text>
                  <TouchableOpacity onPress={() => removeSearch(search)}>
                    <Ionicons name="close" size={16} color="#9BA1A6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        {categories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => handleCategoryPress(category.name)}>
              <Text style={styles.categoryCardText}>{category.name}</Text>
              {category.imageUrl && (
                <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
              )}
            </TouchableOpacity>

            {/* Sub-categories */}
            <View style={styles.subCategoriesContainer}>
              {category.subCategories.map((subCategory) => (
                <TouchableOpacity
                  key={subCategory.id}
                  style={styles.subCategoryItem}
                  onPress={() => handleSubCategoryPress(subCategory.name, category.name)}>
                  <Text style={styles.subCategoryName}>{subCategory.name}</Text>
                  <Text style={styles.subCategoryCount}>({subCategory.itemCount} items)</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9BA1A6" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Popular this week */}
        {popularProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular this week</Text>
              <TouchableOpacity onPress={() => router.push('/products')}>
                <Text style={styles.showAll}>Show all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.popularProductsGrid}>
              {popularProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.popularProductCard}
                  onPress={() => router.push(`/product/${product.id}`)}>
                  <View style={styles.productImageContainer}>
                    {product.imageUrl ? (
                      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                    ) : (
                      <View style={[styles.productImage, styles.placeholderImage]}>
                        <Ionicons name="image-outline" size={30} color="#9BA1A6" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>$ {product.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9BA1A6',
  },
  recentSearchesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  recentSearchesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  searchTagText: {
    fontSize: 14,
    color: '#000000',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    height: 150,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryCardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  subCategoriesContainer: {
    gap: 8,
  },
  subCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  subCategoryName: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  subCategoryCount: {
    fontSize: 14,
    color: '#9BA1A6',
    marginRight: 8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  popularProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  popularProductCard: {
    width: '47%',
    marginBottom: 15,
  },
  productImageContainer: {
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
