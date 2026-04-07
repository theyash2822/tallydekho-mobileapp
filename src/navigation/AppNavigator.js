import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { SplashScreen } from '../components/SplashSceen';
import LoginScreen from '../pages/Login';
import OtpScreen from '../pages/OtpScreen';
import Getstarted from '../pages/GetStartedScreen';
import SyncTally from '../pages/SyncTally';
import PairTallywithPasskey from '../pages/PairTallywithPasskey';
import PairTallynew from '../pages/Pairtallynew';
import SalesScreen from '../pages/SalesScreen';
import ExpensesScreen from '../pages/ExpensesScreen';
import PurchasesScreen from '../pages/PurchasesScreen';
import InvoiceScreen from '../pages/InvoiceScreen';
import InvoiceScreen2 from '../pages/InvoiceScreen2';
import Quotation from '../pages/Quotations/Quotation';
import CreditNote from '../pages/Notes/CreditNote';
import DebitNote from '../pages/Notes/DebitNote';
import DeliveryNote from '../pages/Notes/DeliveryNote';
import Voucher from '../pages/Vouchers/Voucher';
import PaymentVoucher from '../pages/Vouchers/PaymentVoucher';
import ReceiptVoucher from '../pages/Vouchers/ReceiptVoucher';
import ContraVoucher from '../pages/Vouchers/ContraVoucher';
import JournalVoucher from '../pages/Vouchers/JournalVoucher';
import SaleOrders from '../pages/Order/SalesOrders';
import PurchaseOrders from '../pages/Order/PurchaseOrders';
import CreatePartyForm from '../pages/forms/CreatePartyForm';
import CreateStockForm from '../pages/forms/CreateStockForm';
import { LedgerDetails } from '../components/ledger';
import Receivables from '../pages/SwipableCardsScreens/Receivables';
import Payables from '../pages/SwipableCardsScreens/Payables';
import Payments from '../pages/SwipableCardsScreens/Payments';
import Receipts from '../pages/SwipableCardsScreens/Receipts';
import LoansODs from '../pages/SwipableCardsScreens/LoansODs';
import CashInHand from '../pages/SwipableCardsScreens/CashInHand';
import CashRegister from '../pages/Register/CashRegister';
import SalesRegister from '../pages/Register/SalesRegister';
import ExpenseRegister from '../pages/Register/ExpenseRegister';
import PurchaseRegister from '../pages/Register/PurchaseRegister';
import {
  AgingItemsScreen,
  ExpiryScheduleScreen,
  FastVsSlowMovingScreen,
  ItemDetailScreen,
  MovementAnalyticsScreen,
  NegativeStockExceptionsScreen,
  OnHandStock,
  OnHandStockItemDetail,
  PrintScreen,
  ReorderQueueScreen,
  StockBarcode,
  StockLedgerScreen,
  StockReports,
  StockSettings,
  StockSnapshotScreen,
  TotalStock,
  TotalStockScreen,
  TransferHistoryScreen,
  ValuationSummary,
  WarehouseDetailScreen,
  WarehousesListScreen,
} from '../components/stocksManagement';
import TransferDetails from '../components/stocksManagement/StockActions/StockReports/TransferDetailsScreen';
import {
  AIInsights,
  AuditTrail,
  Compliance,
  ComplianceEInvoicing,
  ComplianceEWayBill,
  DayBook,
  Financial,
  OtherTaxes,
  UnmatchedList,
} from '../components/reports';
import SettingsScreen from '../pages/Settings';
import {
  AboutVersions,
  BankFeeds,
  ChannelsQuietHours,
  CompanyInformation,
  ComplianceReminders,
  CurrencyNumberFormat,
  DataSecurity,
  EInvoice,
  EWayBill,
  HelpCenter,
  LanguageRegion,
  LicenseScreen,
  LowStockExpiryAlerts,
  PaymentReminder,
  Profile,
  TallyERPSync,
  VoucherConfiguration,
} from '../components/settings';
import Quotations from '../pages/Vouchers-notes-orders-display/Quotations';
import Orders from '../pages/Vouchers-notes-orders-display/Orders';
import Notes from '../pages/Vouchers-notes-orders-display/Notes';
import Vouchers from '../pages/Vouchers-notes-orders-display/Vouchers';
import Invoices from '../pages/Vouchers-notes-orders-display/Invoices';
import ScannerScreen from '../pages/Scanner';
import NotificationsScreen from '../pages/NotificationScreen';
import EInvoicesList from '../pages/EInvoiceList';
import EInvoices from '../pages/EInvoice';
import EWayBillList from '../pages/EWayBillList';
import EWayBillScreen from '../pages/EWayBill';
import PurchaseInvoice from '../pages/Invoice/PurchaseInvoice';
import CashDetailScreen from '../pages/CashDetailScreen';
import SalesInvoiceScreen from '../pages/Invoice/SalesInvoice';
import Dummy from '../pages/Vouchers-notes-orders-display/Dummy';
import GSTScreen from '../components/reports/Compliance/components/GST';
import TallyDekhoWebView from '../components/common/Webview';
import OpenRegister from '../pages/OpenRegister';
import StockTransferScreen from '../pages/Stocks/StockTransferScreen';
import AddItemScreen from '../pages/Stocks/AddItemScreen';
import AddWarehouseScreen from '../pages/Stocks/AddWarehouseScreen';
import StockAdjustmentScreen from '../pages/Stocks/StockAdjustmentScreen';
import AddLedgerScreen from '../pages/Ledgers/AddLedgerScreen';
import HelpCenterOld from '../components/settings/ContactAndInformations/HelpcenterOld';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ initialRoute }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="otp" component={OtpScreen} />
      <Stack.Screen name="getStarted" component={Getstarted} />
      <Stack.Screen name="sync" component={SyncTally} />
      <Stack.Screen name="pairWithPassKey" component={PairTallywithPasskey} />
      <Stack.Screen name="pairNew" component={PairTallynew} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* ===== MAIN BUSINESS SCREENS ===== */}
      <Stack.Screen name="sales" component={SalesScreen} />
      <Stack.Screen name="expenses" component={ExpensesScreen} />
      <Stack.Screen name="purchases" component={PurchasesScreen} />
      <Stack.Screen name="CashDetailScreen" component={CashDetailScreen} />

      {/* ===== INVOICES & DOCUMENTS ===== */}
      <Stack.Screen name="salesInvoice" component={SalesInvoiceScreen} />
      <Stack.Screen name="purchaseInvoice" component={PurchaseInvoice} />
      <Stack.Screen name="invoice" component={InvoiceScreen} />
      <Stack.Screen name="invoice2" component={InvoiceScreen2} />
      <Stack.Screen name="quotation" component={Quotation} />
      <Stack.Screen name="creditNote" component={CreditNote} />
      <Stack.Screen name="debitNote" component={DebitNote} />
      <Stack.Screen name="deliveryNote" component={DeliveryNote} />
      <Stack.Screen name="voucher" component={Voucher} />
      <Stack.Screen name="paymentVoucher" component={PaymentVoucher} />
      <Stack.Screen name="receiptVoucher" component={ReceiptVoucher} />
      <Stack.Screen name="contraVoucher" component={ContraVoucher} />
      <Stack.Screen name="journalVoucher" component={JournalVoucher} />

      {/* ===== ORDERS ===== */}
      <Stack.Screen name="salesOrders" component={SaleOrders} />
      <Stack.Screen name="purchaseOrders" component={PurchaseOrders} />
      {/* ===== TALLY MASTERS ===== */}
      <Stack.Screen name="createParty" component={CreatePartyForm} />
      <Stack.Screen name="createStockItem" component={CreateStockForm} />

      {/* ===== FINANCIAL MANAGEMENT ===== */}
      <Stack.Screen name="ledgerDetails" component={LedgerDetails} />
      <Stack.Screen name="receivables" component={Receivables} />
      <Stack.Screen name="payables" component={Payables} />
      <Stack.Screen name="payments" component={Payments} />
      <Stack.Screen name="receipts" component={Receipts} />
      <Stack.Screen name="loansODs" component={LoansODs} />
      <Stack.Screen name="cashinHand" component={CashInHand} />
      <Stack.Screen name="cashRegister" component={CashRegister} />

      {/* ===== REGISTERS ===== */}
      <Stack.Screen name="salesRegister" component={SalesRegister} />
      <Stack.Screen name="expenseRegister" component={ExpenseRegister} />
      <Stack.Screen name="purchaseRegister" component={PurchaseRegister} />

      {/* ===== STOCK MANAGEMENT ===== */}
      <Stack.Screen name="valuationSummary" component={ValuationSummary} />
      <Stack.Screen
        name="fastandSlowMoving"
        component={FastVsSlowMovingScreen}
      />
      <Stack.Screen name="expirySchedule" component={ExpiryScheduleScreen} />
      <Stack.Screen name="totalStock" component={TotalStockScreen} />
      <Stack.Screen name="onHandStock" component={OnHandStock} />
      <Stack.Screen name="itemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="agingItems" component={AgingItemsScreen} />
      <Stack.Screen name="reorderQueue" component={ReorderQueueScreen} />
      <Stack.Screen name="warehousesList" component={WarehousesListScreen} />
      <Stack.Screen name="warehouseDetails" component={WarehouseDetailScreen} />
      <Stack.Screen name="stockReports" component={StockReports} />
      <Stack.Screen name="stockLedger" component={StockLedgerScreen} />
      <Stack.Screen
        name="negativeStockExceptions"
        component={NegativeStockExceptionsScreen}
      />
      <Stack.Screen name="stockSnapshot" component={StockSnapshotScreen} />
      <Stack.Screen
        name="TransferHistoryScreen"
        component={TransferHistoryScreen}
      />
      <Stack.Screen name="TransferDetails" component={TransferDetails} />
      <Stack.Screen name="stockSettings" component={StockSettings} />
      <Stack.Screen name="stockBarcode" component={StockBarcode} />
      <Stack.Screen name="warehouseTotalStock" component={TotalStock} />
      <Stack.Screen name="warehouseOnHandStock" component={OnHandStock} />
      <Stack.Screen
        name="onHandStockItemDetail"
        component={OnHandStockItemDetail}
      />
      <Stack.Screen name="print" component={PrintScreen} />
      <Stack.Screen
        name="movementAnalytics"
        component={MovementAnalyticsScreen}
      />

      {/* ===== STOCK MANAGEMENT SCREENS ===== */}
      <Stack.Screen name="stockTransfer" component={StockTransferScreen} />
      <Stack.Screen name="quickStockAccess" component={StockAdjustmentScreen} />
      <Stack.Screen name="addItem" component={AddItemScreen} />
      <Stack.Screen name="addWarehouse" component={AddWarehouseScreen} />

      {/* ===== LEDGER MANAGEMENT ===== */}
      <Stack.Screen name="addLedger" component={AddLedgerScreen} />

      {/* ===== REPORTS & ANALYTICS ===== */}
      <Stack.Screen name="Compliance" component={Compliance} />
      <Stack.Screen name="otherTaxes" component={OtherTaxes} />
      <Stack.Screen name="openRegister" component={OpenRegister} />
      <Stack.Screen name="gst" component={GSTScreen} />
      <Stack.Screen name="UnmatchedList" component={UnmatchedList} />
      <Stack.Screen name="financial" component={Financial} />
      <Stack.Screen name="audittrail" component={AuditTrail} />
      <Stack.Screen name="daybook" component={DayBook} />
      <Stack.Screen name="aiinsights" component={AIInsights} />

      {/* ===== SETTINGS & CONFIGURATION ===== */}
      <Stack.Screen name="settings" component={SettingsScreen} />
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="license" component={LicenseScreen} />
      <Stack.Screen name="companyInformation" component={CompanyInformation} />
      <Stack.Screen name="languageRegion" component={LanguageRegion} />
      <Stack.Screen
        name="currencyNumberFormat"
        component={CurrencyNumberFormat}
      />
      <Stack.Screen name="Support" component={HelpCenter} />
      <Stack.Screen name="SupportOld" component={HelpCenterOld} />
      <Stack.Screen
        name="NotificationChannels"
        component={ChannelsQuietHours}
      />
      <Stack.Screen name="StockAlerts" component={LowStockExpiryAlerts} />
      <Stack.Screen
        name="ComplianceReminders"
        component={ComplianceReminders}
      />
      <Stack.Screen name="PaymentReminders" component={PaymentReminder} />
      <Stack.Screen name="tallyerp" component={TallyERPSync} />
      <Stack.Screen name="BankFeeds" component={BankFeeds} />
      <Stack.Screen name="AboutVersions" component={AboutVersions} />
      <Stack.Screen name="DataSecurity" component={DataSecurity} />
      <Stack.Screen name="VoucherConfig" component={VoucherConfiguration} />

      {/* ===== INTEGRATIONS & E-SERVICES ===== */}
      <Stack.Screen name="eWayBill" component={EWayBill} />
      <Stack.Screen name="EWayBill" component={EWayBillScreen} />
      <Stack.Screen name="EWayBillList" component={EWayBillList} />
      <Stack.Screen name="EInvoice" component={EInvoice} />
      <Stack.Screen name="eInvoices" component={EInvoices} />
      <Stack.Screen name="EInvoicesList" component={EInvoicesList} />
      <Stack.Screen name="complianceewaybill" component={ComplianceEWayBill} />
      <Stack.Screen
        name="complianceeinvoicing"
        component={ComplianceEInvoicing}
      />

      {/* ===== UTILITIES & TOOLS ===== */}
      <Stack.Screen name="notification" component={NotificationsScreen} />
      <Stack.Screen name="scanner" component={ScannerScreen} />

      {/* ===== DISPLAY & VIEW SCREENS ===== */}
      <Stack.Screen name="dummyscreen" component={Dummy} />
      <Stack.Screen name="invoices" component={Invoices} />
      <Stack.Screen name="vouchers" component={Vouchers} />
      <Stack.Screen name="notes" component={Notes} />
      <Stack.Screen name="orders" component={Orders} />
      <Stack.Screen name="quotations" component={Quotations} />
      <Stack.Screen
        name="TallyDekhoWebView"
        component={TallyDekhoWebView}
        options={{ title: 'TallyDekho' }}
      />
    </Stack.Navigator>
  );
}
