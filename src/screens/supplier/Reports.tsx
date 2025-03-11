import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthStackScreenProps } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Text from '../../components/Text';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Header from '../../components/Header';
import theme from '../../theme';
import { firestoreDB } from '../../services/database';

// ... keep existing types and interfaces ...

const Reports: React.FC<Props> = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const generateReport = async (type: ReportType) => {
    try {
      if (!user) return;
      setLoading(true);

      const supplier = await firestoreDB.getSupplierByUserId(user.uid);
      if (!supplier) {
        Alert.alert('Error', 'Supplier profile not found');
        return;
      }

      let reportData = '';
      const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

      // ... keep existing report generation logic ...

      await Share.share({
        message: reportData,
        title: `${REPORT_TYPES.find(r => r.type === type)?.title} - ${dateRange}`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    isStart: boolean
  ) => {
    if (isStart) {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    } else {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Generate Reports"
        subtitle="Create and share detailed business reports"
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
        <Card variant="filled" style={styles.dateRangeCard}>
          <Text style={styles.dateRangeTitle}>Select Date Range</Text>
          <View style={styles.dateRange}>
            <Button
              title={startDate.toLocaleDateString()}
              variant="outline"
              size="sm"
              icon="calendar-today"
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            />

            <Text style={styles.dateRangeSeparator}>to</Text>

            <Button
              title={endDate.toLocaleDateString()}
              variant="outline"
              size="sm"
              icon="calendar-today"
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
            />
          </View>
        </Card>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, true)}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, false)}
          />
        )}

        <View style={styles.reportTypes}>
          {REPORT_TYPES.map((report) => (
            <Card
              key={report.type}
              variant={selectedReport === report.type ? 'elevated' : 'outlined'}
              onPress={() => {
                setSelectedReport(report.type);
                generateReport(report.type);
              }}
              style={[
                styles.reportCard,
                selectedReport === report.type && styles.selectedReport,
              ]}
            >
              <View style={styles.reportContent}>
                <View
                  style={[
                    styles.reportIcon,
                    { backgroundColor: theme.colors.primary + '10' },
                  ]}
                >
                  <MaterialIcons
                    name={report.icon as any}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                  <View style={styles.reportBadges}>
                    <Badge
                      label="Excel"
                      variant="success"
                      size="sm"
                      style={styles.reportBadge}
                    />
                    <Badge
                      label="PDF"
                      variant="info"
                      size="sm"
                      style={styles.reportBadge}
                    />
                    <Badge
                      label="CSV"
                      variant="warning"
                      size="sm"
                      style={styles.reportBadge}
                    />
                  </View>
                </View>
                {loading && selectedReport === report.type ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                    style={styles.reportAction}
                  />
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={theme.colors.textSecondary}
                    style={styles.reportAction}
                  />
                )}
              </View>
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
  dateRangeCard: {
    margin: theme.spacing.md,
  },
  dateRangeTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  dateButton: {
    flex: 1,
  },
  dateRangeSeparator: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  reportTypes: {
    padding: theme.spacing.md,
  },
  reportCard: {
    marginBottom: theme.spacing.sm,
  },
  selectedReport: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  reportDescription: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  reportBadges: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  reportBadge: {
    marginRight: theme.spacing.xs,
  },
  reportAction: {
    marginLeft: theme.spacing.md,
  },
});

export default Reports; 