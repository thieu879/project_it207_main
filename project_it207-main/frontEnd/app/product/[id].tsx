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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { commentService, Comment } from '@/services/comment';
import { Product } from '@/types';

const { width } = Dimensions.get('window');

const COLORS = [
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Black', value: '#000000' },
  { name: 'Coral', value: '#FF7F50' },
];

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { fetchProductById, selectedProduct, isLoading, fetchProducts, products } = useProducts();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id as string);
      loadComments();
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      loadSimilarProducts();
    }
  }, [selectedProduct, id]);

  const loadComments = async () => {
    if (!id) return;
    try {
      setLoadingComments(true);
      const commentsData = await commentService.getCommentsByProductId(Number(id));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadSimilarProducts = async () => {
    if (!selectedProduct) return;
    try {
      const response = await fetchProducts({
        page: 0,
        limit: 4,
        category: selectedProduct.category?.name,
      });
      const similar = response.products.filter((p) => p.id !== Number(id));
      setSimilarProducts(similar.slice(0, 3));
    } catch (error) {
      console.error('Error loading similar products:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedProduct) return;
    try {
      await toggleWishlist(selectedProduct.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      await addToCart(selectedProduct.id, quantity);
      Alert.alert('Success', 'Product added to cart!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add product to cart');
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(selectedProduct?.quantity || 1, quantity + delta)));
  };

  const calculateRatingStats = () => {
    return {
      average: 4.9,
      total: 251,
      distribution: {
        5: 80,
        4: 12,
        3: 5,
        2: 3,
        1: 0,
      },
    };
  };

  if (isLoading || !selectedProduct) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </View>
    );
  }

  const isFavorite = isInWishlist(selectedProduct.id);
  const images = selectedProduct.imageUrl ? [selectedProduct.imageUrl] : [];
  const ratingStats = calculateRatingStats();
  const descriptionText = selectedProduct.description || 'No description available.';
  const displayDescription = showFullDescription
    ? descriptionText
    : descriptionText.substring(0, 150);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF3B30' : '#000000'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <Image source={{ uri: images[selectedImageIndex] }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={60} color="#9BA1A6" />
            </View>
          )}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === selectedImageIndex && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{selectedProduct.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>$ {selectedProduct.price.toFixed(2)}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= Math.round(ratingStats.average) ? '#FFD700' : '#E5E5E5'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {ratingStats.average.toFixed(1)} ({ratingStats.total} reviews)
            </Text>
          </View>

          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>Color</Text>
            <View style={styles.colorOptions}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: color.value,
                      borderWidth: selectedColor === color.name ? 3 : 1,
                      borderColor: selectedColor === color.name ? '#000000' : '#E5E5E5',
                    },
                    color.value === '#F5F5DC' && styles.whiteBorder,
                  ]}
                  onPress={() => setSelectedColor(color.name)}
                />
              ))}
            </View>
          </View>

          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>Size</Text>
            <View style={styles.sizeOptions}>
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}>
                  <Text
                    style={[
                      styles.sizeOptionText,
                      selectedSize === size && styles.sizeOptionTextSelected,
                    ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{displayDescription}</Text>
            {descriptionText.length > 150 && (
              <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.ratingSummary}>
              <View style={styles.ratingAverage}>
                <Text style={styles.ratingAverageText}>{ratingStats.average.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={14}
                      color={star <= Math.round(ratingStats.average) ? '#FFD700' : '#E5E5E5'}
                    />
                  ))}
                </View>
                <Text style={styles.ratingTotalText}>({ratingStats.total} reviews)</Text>
              </View>
              <View style={styles.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} style={styles.ratingBarRow}>
                    <Text style={styles.ratingBarLabel}>{rating}</Text>
                    <View style={styles.ratingBarContainer}>
                      <View
                        style={[
                          styles.ratingBar,
                          {
                            width: `${ratingStats.distribution[rating as keyof typeof ratingStats.distribution]}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.ratingBarPercentage}>
                      {ratingStats.distribution[rating as keyof typeof ratingStats.distribution]}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {loadingComments ? (
              <Text style={styles.loadingText}>Loading reviews...</Text>
            ) : comments.length > 0 ? (
              <View style={styles.commentsList}>
                {comments.slice(0, 2).map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.username}</Text>
                      <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons key={star} name="star" size={12} color="#FFD700" />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <Text style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noCommentsText}>No reviews yet</Text>
            )}
          </View>

          {similarProducts.length > 0 && (
            <View style={styles.similarProductsSection}>
              <Text style={styles.sectionTitle}>Similar Product</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.similarProductCard}
                    onPress={() => router.push(`/product/${product.id}`)}>
                    {product.imageUrl ? (
                      <Image source={{ uri: product.imageUrl }} style={styles.similarProductImage} />
                    ) : (
                      <View style={[styles.similarProductImage, styles.placeholderImage]}>
                        <Ionicons name="image-outline" size={30} color="#9BA1A6" />
                      </View>
                    )}
                    <Text style={styles.similarProductName}>{product.name}</Text>
                    <Text style={styles.similarProductPrice}>$ {product.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.quantityAndCartContainer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}>
              <Ionicons
                name="remove"
                size={20}
                color={quantity <= 1 ? '#9BA1A6' : '#000000'}
              />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
              disabled={quantity >= (selectedProduct?.quantity || 1)}>
              <Ionicons
                name="add"
                size={20}
                color={quantity >= (selectedProduct?.quantity || 1) ? '#9BA1A6' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.addToCartButton, isCartLoading && styles.addToCartButtonDisabled]}
            onPress={handleAddToCart}
            disabled={isCartLoading}>
            <Text style={styles.addToCartText}>
              {isCartLoading ? 'Adding...' : 'Add To Cart'}
            </Text>
          </TouchableOpacity>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
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
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#F5F5F5',
    marginTop: 60,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  selectionContainer: {
    marginBottom: 20,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 15,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeOptionSelected: {
    backgroundColor: '#2C1810',
    borderColor: '#2C1810',
  },
  sizeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sizeOptionTextSelected: {
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
    marginTop: 5,
  },
  reviewsSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  ratingSummary: {
    marginBottom: 20,
  },
  ratingAverage: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingAverageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  ratingTotalText: {
    fontSize: 14,
    color: '#9BA1A6',
    marginTop: 5,
  },
  ratingDistribution: {
    gap: 8,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingBarLabel: {
    fontSize: 14,
    color: '#000000',
    width: 20,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  ratingBarPercentage: {
    fontSize: 12,
    color: '#9BA1A6',
    width: 40,
    textAlign: 'right',
  },
  commentsList: {
    gap: 15,
  },
  commentItem: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  commentText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#9BA1A6',
    textAlign: 'center',
    padding: 20,
  },
  similarProductsSection: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  similarProductCard: {
    width: 150,
    marginRight: 15,
  },
  similarProductImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  similarProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  similarProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  quantityAndCartContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
