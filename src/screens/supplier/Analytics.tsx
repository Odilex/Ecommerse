import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Order, ProductCategory } from '../../types/models';
import Text from '../../components/Text';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Chart from '../../components/Chart';
import Header from '../../components/Header';
import theme from '../../theme';
import { firestoreDB } from '../../services/database';

// ... keep existing types and interfaces ...

const Analytics: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const loadAnalytics = async (showLoading = true) => {
    try {
      if (!user) return;
      if (showLoading) setLoading(true);

      const supplier = await firestoreDB.getSupplierByUserId(user.uid);
      if (!supplier) {
        Alert.alert('Error', 'Supplier profile not found');
        return;
      }

      // ... keep existing analytics calculation logic ...

      setAnalytics({
        revenue: {
          today: todayOrders.reduce((sum, order) => sum + order.payment.total, 0),
          week: weekOrders.reduce((sum, order) => sum + order.payment.total, 0),
          month: monthOrders.reduce((sum, order) => sum + order.payment.total, 0),
          total: orders.reduce((sum, order) => sum + order.payment.total, 0),
        },
        orders: {
          total: orders.length,
          completed: orders.filter(order => order.status === 'DELIVERED').length,
          cancelled: orders.filter(order => order.status === 'CANCELLED').length,
          averageValue: orders.length > 0
            ? orders.reduce((sum, order) => sum + order.payment.total, 0) / orders.length
            : 0,
        },
        products: {
          total: products.length,
          outOfStock: products.filter(p => p.quantity === 0).length,
          lowStock: products.filter(p => p.quantity > 0 && p.quantity < 10).length,
          byCategory: productsByCategory,
        },
        topProducts,
        revenueChart: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: weekOrders.reduce((acc, order) => {
              const day = new Date(order.createdAt).getDay();
              acc[day] = (acc[day] || 0) + order.payment.total;
              return acc;
            }, Array(7).fill(0)),
          }],
        },
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics(false);
    setRefreshing(false);
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    subtitle?: string,
    icon?: string,
    color: string = theme.colors.primary,
    trend?: { value: number; isPositive: boolean }
  ) => (
    <Card
      variant="elevated"
      style={[styles.metricCard, { borderLeftColor: color }]}
    >
      <View style={styles.metricHeader}>
        {icon && (
          <View style={[styles.metricIcon, { backgroundColor: color + '10' }]}>
            <MaterialIcons name={icon as any} size={24} color={color} />
          </View>
        )}
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <View style={styles.metricFooter}>
        {subtitle && (
          <Text style={styles.metricSubtitle}>{subtitle}</Text>
        )}
        {trend && (
          <Badge
            label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
            variant={trend.isPositive ? 'success' : 'error'}
            size="sm"
            dot
          />
        )}
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load analytics</Text>
        <Button
          title="Retry"
          onPress={() => loadAnalytics()}
          icon="refresh"
          variant="outline"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Business Analytics"
        rightIcon="refresh"
        onRightPress={onRefresh}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.timeRangeButtons}>
          {['week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              title={range.charAt(0).toUpperCase() + range.slice(1)}
              variant={timeRange === range ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setTimeRange(range as 'week' | 'month' | 'year')}
              style={styles.timeRangeButton}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderMetricCard(
              'Today',
              formatPrice(analytics.revenue.today),
              'vs. yesterday',
              'today',
              theme.colors.success,
              { value: 12.5, isPositive: true }
            )}
            {renderMetricCard(
              'This Week',
              formatPrice(analytics.revenue.week),
              'vs. last week',
              'date-range',
              theme.colors.primary,
              { value: 8.3, isPositive: true }
            )}
            {renderMetricCard(
              'This Month',
              formatPrice(analytics.revenue.month),
              'vs. last month',
              'calendar-today',
              theme.colors.info,
              { value: 5.2, isPositive: false }
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Trend</Text>
          <Chart
            type="line"
            data={analytics.revenueChart}
            yAxisSuffix=" RWF"
            formatYLabel={(value) => `${parseInt(value).toLocaleString()}`}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Statistics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Total Orders',
              analytics.orders.total,
              'All time',
              'shopping-bag'
            )}
            {renderMetricCard(
              'Completed',
              analytics.orders.completed,
              `${((analytics.orders.completed / analytics.orders.total) * 100).toFixed(1)}%`,
              'check-circle',
              theme.colors.success
            )}
            {renderMetricCard(
              'Cancelled',
              analytics.orders.cancelled,
              `${((analytics.orders.cancelled / analytics.orders.total) * 100).toFixed(1)}%`,
              'cancel',
              theme.colors.error
            )}
            {renderMetricCard(
              'Average Order',
              formatPrice(analytics.orders.averageValue),
              'Per order',
              'analytics',
              theme.colors.secondary
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Status</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Total Products',
              analytics.products.total,
              'All products',
              'inventory'
            )}
            {renderMetricCard(
              'Out of Stock',
              analytics.products.outOfStock,
              `${((analytics.products.outOfStock / analytics.products.total) * 100).toFixed(1)}%`,
              'error',
              theme.colors.error
            )}
            {renderMetricCard(
              'Low Stock',
              analytics.products.lowStock,
              `${((analytics.products.lowStock / analytics.products.total) * 100).toFixed(1)}%`,
              'warning',
              theme.colors.warning
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          {analytics.topProducts.map((product, index) => (
            <Card
              key={product.id}
              variant="outlined"
              style={styles.topProductCard}
            >
              <View style={styles.topProductRankContainer}>
                <Text style={styles.topProductRank}>#{index + 1}</Text>
              </View>
              <View style={styles.topProductInfo}>
                <Text style={styles.topProductName}>{product.name}</Text>
                <Text style={styles.topProductStats}>
                  {product.sales} units • {formatPrice(product.revenue)}
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  timeRangeButton: {
    minWidth: 80,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: Dimensions.get('window').width * 0.4,
    borderLeftWidth: 4,
    margin: theme.spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  metricTitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  metricValue: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  topProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  topProductRankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  topProductRank: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
  },
  topProductStats: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.error,
    textAlign: 'center',
    margin: theme.spacing.md,
  },
  retryButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
});

export default Analytics; 