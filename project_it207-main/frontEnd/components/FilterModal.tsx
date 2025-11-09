import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  priceRange: [number, number];
  colors: string[];
  rating: number | null;
  category: string | null;
  discounts: string[];
}

const COLORS = [
  { name: 'Orange', value: '#FF9500' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Black', value: '#000000' },
  { name: 'Teal', value: '#5AC8FA' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Brown', value: '#8E6E53' },
  { name: 'Pink', value: '#FF69B4' },
];

const DISCOUNTS = ['50% off', '40% off', '30% off', '25% off'];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      priceRange: [10, 80],
      colors: [],
      rating: null,
      category: null,
      discounts: [],
    }
  );

  const handlePriceChange = (min: number, max: number) => {
    setFilters({ ...filters, priceRange: [min, max] });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    setFilters({ ...filters, colors });
  };

  const setRating = (rating: number | null) => {
    setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
  };

  const toggleDiscount = (discount: string) => {
    const discounts = filters.discounts.includes(discount)
      ? filters.discounts.filter((d) => d !== discount)
      : [...filters.discounts, discount];
    setFilters({ ...filters, discounts });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [10, 80],
      colors: [],
      rating: null,
      category: null,
      discounts: [],
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              Filter
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Price */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price</Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Min</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={`$${filters.priceRange[0]}`}
                    editable={false}
                  />
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Max</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={`$${filters.priceRange[1]}`}
                    editable={false}
                  />
                </View>
              </View>
              {/* Simple price range display */}
              <View style={styles.priceRangeDisplay}>
                <Text style={styles.priceRangeText}>
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Text>
              </View>
            </View>

            {/* Color */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorContainer}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.name}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.value },
                      filters.colors.includes(color.name) && styles.colorCircleSelected,
                      color.value === '#FFFFFF' && styles.whiteBorder,
                    ]}
                    onPress={() => toggleColor(color.name)}>
                    {filters.colors.includes(color.name) && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Star Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Star Rating</Text>
              <View style={styles.ratingContainer}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      filters.rating === rating && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setRating(rating)}>
                    <Ionicons
                      name="star"
                      size={20}
                      color={filters.rating === rating ? '#FFD700' : '#9BA1A6'}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        filters.rating === rating && styles.ratingTextSelected,
                      ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <TouchableOpacity style={styles.categoryButton}>
                <Ionicons name="shirt-outline" size={20} color="#000000" />
                <Text style={styles.categoryText}>Crop Tops</Text>
                <Ionicons name="chevron-down" size={20} color="#9BA1A6" />
              </TouchableOpacity>
            </View>

            {/* Discount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discount</Text>
              <View style={styles.discountContainer}>
                {DISCOUNTS.map((discount) => (
                  <TouchableOpacity
                    key={discount}
                    style={[
                      styles.discountButton,
                      filters.discounts.includes(discount) && styles.discountButtonSelected,
                    ]}
                    onPress={() => toggleDiscount(discount)}>
                    <Text
                      style={[
                        styles.discountText,
                        filters.discounts.includes(discount) && styles.discountTextSelected,
                      ]}>
                      {discount}
                    </Text>
                    {filters.discounts.includes(discount) && (
                      <Ionicons name="close-circle" size={16} color="#000000" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 5,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#F5F5F5',
  },
  priceRangeDisplay: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: '#000000',
    borderWidth: 3,
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
  },
  ratingButtonSelected: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#9BA1A6',
  },
  ratingTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
  },
  categoryText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000000',
  },
  discountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
    gap: 5,
  },
  discountButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  discountText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  discountTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#2C1810',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

