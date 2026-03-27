import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {TextSemibold, TextRegular} from '../../../../utils/CustomText';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import Svg, {Circle, Path, Text as SvgText} from 'react-native-svg';
import {Icons} from '../../../../utils/Icons';

const {width} = Dimensions.get('window');

const Compliance = () => {
  const navigation = useNavigation();

  // Mock data for compliance sections
  const gstData = {
    pending: true,
    unmatched: 7,
  };

  const ewayBillData = {
    active: 32,
    expiringSoon: 21,
    expired: 47,
  };

  const eInvoicingData = {
    unreconciledVouchers: 14,
    totalVouchers: 100,
  };

  const otherTaxesData = {
    tdsPending: 14,
    totalTds: 100,
  };

  const renderGSTSection = () => {
    return (
      <TouchableOpacity
        style={styles.sectionCard}
        onPress={() => navigation.navigate('gst')}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={styles.iconContainer}>
              <Icons.Gst height={22} width={22} />
            </View>
            <TextSemibold style={styles.cardTitle} fontSize={16}>
              GST
            </TextSemibold>
          </View>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>

        {/* Separator line */}
        <View style={styles.separator} />

        <View style={styles.gstContent}>
          <View style={styles.statusBoxesContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Filing Status</Text>
              <Text style={styles.statusValue}>Pending</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Unmatched</Text>
              <Text style={styles.statusCount}>{gstData.unmatched}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEwayBillSection = () => {
    const total =
      ewayBillData.active + ewayBillData.expiringSoon + ewayBillData.expired;
    const activePercentage = (ewayBillData.active / total) * 100;
    const expiringPercentage = (ewayBillData.expiringSoon / total) * 100;
    const expiredPercentage = (ewayBillData.expired / total) * 100;

    // Calculate angles for each segment
    const activeAngle = (activePercentage / 100) * 360;
    const expiringAngle = (expiringPercentage / 100) * 360;
    const expiredAngle = (expiredPercentage / 100) * 360;

    const radius = 35;
    const centerX = 40;
    const centerY = 40;

    // Helper function to create arc path
    const createArcPath = (startAngle, endAngle, radius, centerX, centerY) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    return (
      <TouchableOpacity
        style={styles.sectionCard}
        onPress={() => navigation.navigate('complianceewaybill')}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={styles.iconContainer}>
              <Icons.EwayBill2 height={20} width={20} />
              {/* <Ionicons name="document-text" size={20} color="#6B7280" /> */}
            </View>
            <TextSemibold style={styles.cardTitle} fontSize={16}>
              E-way Bill
            </TextSemibold>
          </View>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>

        {/* Separator line */}
        <View style={styles.separator} />

        <View style={styles.ewayContent}>
          <View style={styles.chartContainer}>
            <Svg width={80} height={80}>
              {/* Background circle */}
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth={8}
              />

              {/* Active segment (Green) */}
              <Path
                d={createArcPath(0, activeAngle, radius, centerX, centerY)}
                fill="none"
                stroke="#10B981"
                strokeWidth={8}
                strokeLinecap="round"
              />

              {/* Expiring soon segment (Blue) */}
              <Path
                d={createArcPath(
                  activeAngle,
                  activeAngle + expiringAngle,
                  radius,
                  centerX,
                  centerY,
                )}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth={8}
                strokeLinecap="round"
              />

              {/* Expired segment (Orange) */}
              <Path
                d={createArcPath(
                  activeAngle + expiringAngle,
                  360,
                  radius,
                  centerX,
                  centerY,
                )}
                fill="none"
                stroke="#E76E50"
                strokeWidth={8}
                strokeLinecap="round"
              />
            </Svg>

            {/* <View style={styles.chartCenter}>
              <Text style={styles.chartCenterText}>{total}</Text>
              <Text style={styles.chartCenterSubText}>Total</Text>
            </View> */}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: '#10B981'}]}
              />
              <Text style={styles.legendText}>Active</Text>
              <Text style={styles.legendPercentage}>
                {Math.round(activePercentage)}%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: '#0EA5E9'}]}
              />
              <Text style={styles.legendText}>Expiring soon</Text>
              <Text style={styles.legendPercentage}>
                {Math.round(expiringPercentage)}%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: '#E76E50'}]}
              />
              <Text style={styles.legendText}>Expired</Text>
              <Text style={styles.legendPercentage}>
                {Math.round(expiredPercentage)}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEInvoicingSection = () => {
    const progressPercentage =
      (eInvoicingData.unreconciledVouchers / eInvoicingData.totalVouchers) *
      100;

    return (
      <TouchableOpacity
        style={styles.sectionCard}
        onPress={() => navigation.navigate('complianceeinvoicing')}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={styles.iconContainer}>
              <Icons.Einvoicing height={22} width={22} />
            </View>
            <TextSemibold style={styles.cardTitle} fontSize={16}>
              E-Invoicing
            </TextSemibold>
          </View>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>

        {/* Separator line */}
        <View style={styles.separator} />

        <View style={styles.eInvoicingContent}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Unreconciled vouchers</Text>
            <Text style={styles.statusCount}>
              {eInvoicingData.unreconciledVouchers}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, {width: `${progressPercentage}%`}]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOtherTaxesSection = () => {
    const progressPercentage =
      (otherTaxesData.tdsPending / otherTaxesData.totalTds) * 100;

    return (
      <TouchableOpacity
        style={styles.sectionCard}
        onPress={() => navigation.navigate('otherTaxes')}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={styles.iconContainer}>
              <Icons.OtherTaxes height={24} width={24} />
            </View>
            <TextSemibold style={styles.cardTitle} fontSize={16}>
              Other Taxes
            </TextSemibold>
          </View>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>

        {/* Separator line */}
        <View style={styles.separator} />

        <View style={styles.otherTaxesContent}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>TDS Pending</Text>
            <Text style={styles.statusCount}>{otherTaxesData.tdsPending}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, {width: `${progressPercentage}%`}]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header
        title={'Compliance'}
        leftIcon={'chevron-left'}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* GST Section */}
          {renderGSTSection()}

          {/* E-way Bill Section */}
          {renderEwayBillSection()}

          {/* E-Invoicing Section */}
          {renderEInvoicingSection()}

          {/* Other Taxes Section */}
          {renderOtherTaxesSection()}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEFF7',
    borderRadius: 20,
  },
  cardTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
  },
  gstContent: {
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  statusValue: {
    fontSize: 12,
    color: '#111i',
    fontWeight: '500',
  },
  statusCount: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    marginLeft: 8,
  },
  ewayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chartContainer: {
    marginRight: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  chartCenterSubText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    fontWeight: '400',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  eInvoicingContent: {
    marginTop: 4,
  },
  otherTaxesContent: {
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusCount: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16C47F',
    borderRadius: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  statusBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 4,
  },
});

export default Compliance;
