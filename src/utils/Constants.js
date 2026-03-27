// src/Icons.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from './Colors';

export const Icons = {
  Left: (size = 24, color = Colors.white) => (
    <Feather name="chevron-left" size={size} color={color} />
  ),
  Phone: (size = 24, color = Colors.white) => (
    <Feather name="phone" size={size} color={color} />
  ),
  Filter: (size = 24, color = Colors.white) => (
    <Feather name="filter" size={size} color={color} />
  ),
  User: (size = 24, color = Colors.white) => (
    <Feather name="user" size={size} color={color} />
  ),
  Globe: (size = 24, color = '#89839a') => (
    <Feather name="globe" size={size} color={color} />
  ),
  Close: (size = 24, color = '#89839a') => (
    <Feather name="x" size={size} color={color} />
  ),
  Menu: (size = 24, color = '#6F7C97') => (
    <MaterialIcons name="filter-list" size={size} color={color} />
  ),
  Expand: (size = 24, color = Colors.white) => (
    <Feather name="chevron-down" size={size} color={color} />
  ),
};

export const allItems = [
  { id: '1', name: 'Stock A', type: 'Stock' },
  { id: '2', name: 'Stock B ', type: 'Stock' },
  { id: '3', name: 'Ledger X ', type: 'Ledger' },
  { id: '4', name: 'Tally Dekho', type: 'Ledger' },
  { id: '5', name: 'Krishi Sewa ', type: 'Ledger' },
  { id: '6', name: 'L&T Systems', type: 'Ledger' },
  { id: '7', name: 'Reliance Digital', type: 'Ledger' },
  { id: '8', name: 'HDFC Securities', type: 'Ledger' },
  { id: '9', name: 'ICICI Direct', type: 'Narration' },
  { id: '10', name: 'Axis Finance', type: 'Narration' },
  { id: '11', name: 'Infosys Tech ', type: 'Narration' },
  { id: '12', name: 'Wipro Services', type: 'Narration' },
  { id: '13', name: 'TCS Solutions', type: 'Narration' },
  { id: '14', name: 'Adani Enterprises', type: 'Narration' },
  { id: '15', name: 'Mahindra Finance', type: 'Narration' },
  { id: '16', name: 'SBI Capital', type: 'Ledger' },
  { id: '17', name: 'Hindustan Unilever', type: 'Ledger' },
  { id: '18', name: 'Maruti Suzuki', type: 'Ledger' },
  { id: '19', name: 'Asian Paints', type: 'Stock' },
  { id: '20', name: 'Tata Steel', type: 'Stock' },
];

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸', language: 'English' },
  { code: '+91', name: 'India', flag: '🇮🇳', language: 'Hindi' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', language: 'English' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', language: 'English' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', language: 'Japanese' },
  { code: '+33', name: 'France', flag: '🇫🇷', language: 'French' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', language: 'German' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', language: 'Italian' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', language: 'Russian' },
  { code: '+86', name: 'China', flag: '🇨🇳', language: 'Mandarin Chinese' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', language: 'Korean' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', language: 'Spanish' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', language: 'Portuguese' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', language: 'Indonesian' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', language: 'Spanish' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', language: 'Afrikaans' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', language: 'Turkish' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', language: 'Dutch' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', language: 'Norwegian' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', language: 'Swedish' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', language: 'Italian' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', language: 'Arabic' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼', language: 'Arabic' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', language: 'Arabic' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰', language: 'Urdu' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', language: 'Arabic' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭', language: 'Thai' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', language: 'Filipino' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', language: 'Malay' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰', language: 'Sinhala' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', language: 'Malay' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', language: 'English' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭', language: 'English' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', language: 'Swahili' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦', language: 'Arabic' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', language: 'Spanish' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', language: 'Spanish' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', language: 'Spanish' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', language: 'Portuguese' },
  { code: '+48', name: 'Poland', flag: '🇵🇱', language: 'Polish' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦', language: 'Ukrainian' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', language: 'Spanish' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', language: 'Māori' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮', language: 'Spanish' },
];

export const quickActions = [
  {
    id: '1',
    name: 'Sales',
    icon: 'trending-up',
    iconcolor: 'red',
    iconBg: '#fff',
    iconBorderColor: Colors.border,
    subOptions: [
      'Create Invoice',
      'Create Quotation',
      'Create Sales Orders',
      'Create Delivery Note',
      'Credit Note',
    ],
  },
  {
    id: '2',
    name: 'Purchase',
    icon: 'shopping-cart',
    iconBg: '#fff',
    iconBorderColor: Colors.border,
    subOptions: ['Purchase Invoice', 'Purchase Order', 'Debit Note'],
  },
  {
    id: '3',
    name: 'Voucher',
    icon: 'credit-card',
    iconBg: '#fff',
    iconBorderColor: Colors.border,
    subOptions: [
      'Payment Voucher',
      'Receipt Voucher',
      'Contra Voucher',
      'Journal Voucher',
    ],
  },
  {
    id: '4',
    name: 'Inventory',
    icon: 'package',
    iconBg: '#fff',
    iconBorderColor: Colors.border,
    subOptions: ['Stock Adjustment', 'Stock Transfer', 'Add Item', 'Add Warehouse', /*'test'*/],
  },
  {
    id: '5',
    name: 'Ledgers',
    icon: 'book',
    iconBg: '#fff',
    iconBorderColor: Colors.border,
    subOptions: ['Sundry Creditors', 'Sundry Debtors', 'Duties & Taxes', 'Custom Groups'],
  },
];

export const getStatusStyle = status => {
  switch (status) {
    case 'Paid':
      return {
        borderColor: '#16C47F',
        backgroundColor: '#E6FCF3',
        dotColor: '#16C47F',
        textColor: '#00C853',
        dotBorderColor: '#00A661',
      };
    case 'Unpaid':
      return {
        borderColor: '#DA3E29',
        backgroundColor: '#F6E6E4',
        dotColor: '#DA3E29',
        textColor: '#D32F2F',
        dotBorderColor: '#9E0200',
      };
    case 'Partial':
      return {
        borderColor: '#8639EB',
        backgroundColor: '#EDE6F8',
        dotColor: '#9043F5',
        textColor: '#9575CD',
        dotBorderColor: '#5E11C3',
      };
    case 'Pending':
      return {
        borderColor: '#FFB22C',
        backgroundColor: '#FFF7EA',
        dotColor: '#FFB22C',
        textColor: '#FFB22C',
        dotBorderColor: '#EB9E18',
      };
    default:
      return {};
  }
};

// Indian States List
export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];


// Standard Tally Groups for Custom Groups
export const standardTallyGroups = [
  'Bank Accounts',
  'Cash-in-Hand',
  'Capital Account',
  'Direct Expenses',
  'Indirect Expenses',
  'Direct Income',
  'Indirect Income',
  'Loans',
  'Assets',
  'Liabilities',
  'Current Assets',
  'Current Liabilities',
  'Fixed Assets',
  'Investments',
  'Sundry Debtors',
  'Sundry Creditors',
  'Duties & Taxes',
  'Sales Accounts',
  'Purchase Accounts',
  'Stock-in-Hand',
  'Deposits',
  'Secured Loans',
  'Unsecured Loans',
  'Reserves & Surplus',
  'Provisions',
];


export const peopleList = [
  'Amit Sharma',
  'Ravi Kumar',
  'Priya Soni',
  'Neha Agarwal',
  'Karan Mehta',
  'Deepak Jain',
  'Riya Singh',
  'Arjun Verma',
  'Swati Joshi',
  'Nikhil Bansal',
];

export const referenceInvoice = [
  'Purchase Invoice',
  'Sales Invoice',
  'Contra Invoice',
  'Delivery Invoice',
  'Regular Invoice',
];

export const globalStyles = {
  textSemibold: (fontSize = 36) => ({
    fontFamily: 's',
    fontSize: fontSize,
  }),
  textRegular: (fontSize = 36) => ({
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: fontSize,
  }),
  textBold: (fontSize = 36) => ({
    fontFamily: 'SF-Pro-Display-Bold',
    fontSize: fontSize,
  }),
  textMedium: (fontSize = 36) => ({
    fontFamily: 'SF-Pro-Display-Medium',
    fontSize: fontSize,
  }),
  textRegularItalic: (fontSize = 14) => ({
    fontFamily: 'SF-Pro-Display-Regularitalic',
    fontSize: fontSize,
  }),
  textBoldItalic: (fontSize = 14) => ({
    fontFamily: 'SF-Pro-Display-Regularitalic',
    fontSize: fontSize,
  }),
  textSemiboldItalic: (fontSize = 14) => ({
    fontFamily: 'SF-Pro-Display-Regularitalic',
    fontSize: fontSize,
  }),
};
