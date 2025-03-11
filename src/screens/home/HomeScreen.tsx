import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Text from '../../components/common/Text';
import ProductCard from '../../components/product/ProductCard';
import theme from '../../theme';

// Temporary mock data
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    price: 150,
    image: 'https://via.placeholder.com/300',
    discount: 20,
    rating: 4.5,
    ratingCount: 128,
    storeName: 'Nike Store',
    storeId: 'nike-store',
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 21',
    price: 180,
    image: 'https://via.placeholder.com/300',
    rating: 4.8,
    ratingCount: 256,
    storeName: 'Adidas Official',
    storeId: 'adidas-store',
  },
  // Add more products...
];

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderProduct = ({ item }) => (
    <ProductCard {...item} />
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="h2">Featured Products</Text>
      </View>

      <FlatList
        data={FEATURED_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        style={styles.productContainer}
      />

      <View style={styles.section}>
        <Text variant="h2">Popular Categories</Text>
        {/* Add categories here */}
      </View>

      <View style={styles.section}>
        <Text variant="h2">Nearby Stores</Text>
        {/* Add nearby stores here */}
      </View>

      <View style={styles.section}>
        <Text variant="h2">Recent Orders</Text>
        {/* Add recent orders here */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.light,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.light,
  },
  productContainer: {
    marginVertical: theme.spacing.md,
  },
  productList: {
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
});

export default HomeScreen; 