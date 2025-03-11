import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../common/Card';
import Text from '../common/Text';
import theme from '../../theme';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  storeName?: string;
  storeId?: string;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  discount,
  rating,
  ratingCount,
  storeName,
  storeId,
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('ProductDetails', { productId: id });
    }
  };

  const handleStorePress = () => {
    if (storeId) {
      navigation.navigate('StoreDetails', { storeId });
    }
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Card
      variant="elevated"
      onPress={handlePress}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <Image source={{ uri: image }} style={styles.image} />
      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text variant="caption" color={theme.colors.text.light}>
            -{discount}%
          </Text>
        </View>
      )}
      <View style={styles.details}>
        <Text variant="subtitle2" numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="subtitle1" color={theme.colors.primary.default}>
            ${discountedPrice.toFixed(2)}
          </Text>
          {discount > 0 && (
            <Text
              variant="caption"
              color={theme.colors.text.tertiary}
              style={styles.originalPrice}
            >
              ${price.toFixed(2)}
            </Text>
          )}
        </View>
        {storeName && (
          <TouchableOpacity onPress={handleStorePress}>
            <Text
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.storeName}
            >
              {storeName}
            </Text>
          </TouchableOpacity>
        )}
        {rating && (
          <View style={styles.ratingContainer}>
            <Text variant="caption" color={theme.colors.text.secondary}>
              ★ {rating.toFixed(1)}
            </Text>
            {ratingCount && (
              <Text variant="caption" color={theme.colors.text.tertiary}>
                ({ratingCount})
              </Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: theme.layout.window.width / 2 - theme.spacing.lg,
    margin: theme.spacing.xs,
  },
  content: {
    padding: 0,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  details: {
    padding: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  originalPrice: {
    marginLeft: theme.spacing.xs,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error.default,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  storeName: {
    marginTop: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
});

export default ProductCard; 