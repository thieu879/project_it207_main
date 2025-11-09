import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types';
import FilterModal, { FilterState } from '@/components/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { products, fetchProducts, isLoading, updateFilters, filters, pagination } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState((params.search as string) || '');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    // Fetch products based on params
    const category = params.category as string;
    const subCategory = params.subCategory as string;
    const search = params.search as string;

    if (category || subCategory || search) {
      updateFilters({
        category: category || subCategory || undefined,
        search: search || undefined,
      });
      fetchProducts({
        category: category || subCategory || undefined,
        search: search || undefined,
        page: 0,
        limit: 20,
      });
    } else {
      fetchProducts({ page: 0, limit: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.subCategory, params.search]);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      try {
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent search:', error);
      }
    }
  };

  const removeRecentSearch = async (query: string) => {
    const updated = recentSearches.filter((s) => s !== query);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      updateFilters({ search: searchQuery });
      fetchProducts({ search: searchQuery, page: 0, limit: 20 });
    }
  };

  const handleFilterApply = (filterState: FilterState) => {
    setAppliedFilters(filterState);
    // Apply filters to product fetch
    // Note: Backend may need to support these filters
    updateFilters({
      // Add filter logic here based on backend support
    });
    fetchProducts({ page: 0, limit: 20 });
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const isFavorite = isInWishlist(item.id);
    const hasDiscount = item.price < 100; // Mock discount logic

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}>
        <View style={styles.productImageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={40} color="#9BA1A6" />
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleToggleFavorite(item.id);
            }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF3B30' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>$ {item.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>$ {(item.price * 1.5).toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#4CAF50" />
          <Ionicons name="star" size={12} color="#4CAF50" />
          <Ionicons name="star" size={12} color="#4CAF50" />
          <Ionicons name="star" size={12} color="#4CAF50" />
          <Ionicons name="star" size={12} color="#4CAF50" />
          <Text style={styles.ratingText}>(34)</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const categoryName = (params.category as string) || (params.subCategory as string) || 'Products';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <View style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
            <Ionicons name="chevron-down" size={16} color="#000000" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar (if on search page) */}
      {params.search && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9BA1A6" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9BA1A6"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9BA1A6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          Found {pagination.total || products.length} {pagination.total === 1 ? 'Result' : 'Results'}
        </Text>
      </View>

      {/* Recent Searches (only show on search page when no results) */}
      {params.search && recentSearches.length > 0 && products.length === 0 && (
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
                onPress={() => {
                  setSearchQuery(search);
                  handleSearch();
                }}>
                <Text style={styles.searchTagText}>{search}</Text>
                <TouchableOpacity onPress={() => removeRecentSearch(search)}>
                  <Ionicons name="close" size={16} color="#9BA1A6" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Product Grid */}
      {isLoading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilterApply}
        initialFilters={appliedFilters || undefined}
      />
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
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
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
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: 14,
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
  productGrid: {
    padding: 15,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: '48%',
    marginBottom: 15,
  },
  productImageContainer: {
    position: 'relative',
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
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9BA1A6',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#9BA1A6',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9BA1A6',
  },
});

