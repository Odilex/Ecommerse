import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Text from './Text';
import theme from '../theme';

type ChartType = 'line' | 'bar';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
}

interface ChartProps {
  type: ChartType;
  data: ChartData;
  title?: string;
  height?: number;
  width?: number;
  yAxisSuffix?: string;
  formatYLabel?: (value: string) => string;
  formatXLabel?: (value: string) => string;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 220,
  width = Dimensions.get('window').width - theme.spacing.md * 2,
  yAxisSuffix = '',
  formatYLabel,
  formatXLabel,
}) => {
  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
    propsForBackgroundLines: {
      stroke: theme.colors.border,
      strokeDasharray: '5, 5',
    },
  };

  const renderChart = () => {
    const commonProps = {
      data,
      width,
      height,
      chartConfig,
      bezier: true,
      style: {
        marginVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
      },
      withInnerLines: true,
      withOuterLines: true,
      withVerticalLines: false,
      withHorizontalLines: true,
      withVerticalLabels: true,
      withHorizontalLabels: true,
      yAxisSuffix,
      formatYLabel,
      formatXLabel,
    };

    switch (type) {
      case 'line':
        return <LineChart {...commonProps} />;
      case 'bar':
        return <BarChart {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});

export default Chart; 