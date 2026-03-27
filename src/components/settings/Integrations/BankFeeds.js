import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SwipeRow } from 'react-native-swipe-list-view';
import Colors from '../../../utils/Colors';
import Header from '../../common/Header';
import LinearGradient from 'react-native-linear-gradient';
import CustomBottomButton from '../../common/BottomButton';
import EditBankModal from './Components/EditBankModal';
import AddBankModal from './Components/AddBankModal';
import CustomAnimatedModal from '../../common/CustomAnimatedModal';
import { Icons } from '../../../utils/Icons';

const BankFeeds = () => {
  const navigation = useNavigation();
  const [openRowKey, setOpenRowKey] = useState(null);
  const rowRefs = useRef({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAddBankModalVisible, setIsAddBankModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      type: 'PRIMARY ACCOUNT',
      isPrimary: true,
      bankName: 'HDFC Bank',
      accountNumber: 'A/c 1234767680002253',
      identifier: 'HDFC090923',
      branch: 'Mumbai Branch',
      accountType: 'CURRENT',
      gradientColors: ['#10B981', '#059669'],
      labelColor: '#D1FAE5',
    },
    {
      id: 2,
      type: 'CURRENT',
      isPrimary: false,
      bankName: 'HDFC Bank',
      accountNumber: 'A/c 1234767680002253',
      identifier: 'HDFC090923',
      branch: 'Mumbai Branch',
      accountType: 'CURRENT',
      gradientColors: ['#3B82F6', '#2563EB'],
      labelColor: '#DBEAFE',
    },
    {
      id: 3,
      type: 'SAVING',
      isPrimary: false,
      bankName: 'HDFC Bank',
      accountNumber: 'A/c 1234767680002253',
      identifier: 'HDFC090923',
      branch: 'Mumbai Branch',
      accountType: 'CURRENT',
      gradientColors: ['#06B6D4', '#0891B2'],
      labelColor: '#CFFAFE',
    },
  ]);

  const handleEdit = accountId => {
    setSelectedAccount(bankAccounts.find(acc => acc.id === accountId));
    setIsEditModalVisible(true);
    // Reset delete modal state when opening edit modal
    setIsDeleteModalVisible(false);
    setAccountToDelete(null);

    if (rowRefs.current[accountId]) {
      rowRefs.current[accountId].closeRow();
    }
  };

  const handleSaveAccount = updatedAccount => {
    setBankAccounts(prevAccounts =>
      prevAccounts.map(acc =>
        acc.id === updatedAccount.id ? updatedAccount : acc,
      ),
    );
    setIsEditModalVisible(false);
    setSelectedAccount(null);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = accountToDelete => {
    setBankAccounts(prevAccounts =>
      prevAccounts.filter(acc => acc.id !== accountToDelete.id),
    );
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    setSelectedAccount(null);
    setAccountToDelete(null);
  };

  const handleDeleteClick = (account) => {
    // Close edit modal first
    setIsEditModalVisible(false);
    setSelectedAccount(null);
    // Set account to delete and open delete modal after delay
    setAccountToDelete(account);
    setTimeout(() => {
      setIsDeleteModalVisible(true);
    }, 500);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setAccountToDelete(null);
  };

  const renderBankCard = (account, index) => (
    <SwipeRow
      key={account.id}
      rightOpenValue={-100}
      disableRightSwipe
      ref={ref => {
        if (ref) rowRefs.current[account.id] = ref;
      }}
      style={{ overflow: 'hidden' }}   // FIX for iOS row spacing
      onRowOpen={() => {
        if (
          openRowKey &&
          openRowKey !== account.id &&
          rowRefs.current[openRowKey]
        ) {
          rowRefs.current[openRowKey].closeRow();
        }
        setOpenRowKey(account.id);
      }}
      onRowClose={() => {
        if (openRowKey === account.id) setOpenRowKey(null);
      }}>

      {/* Hidden row */}
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.editActionContainer}
          onPress={() => handleEdit(account.id)}>
          <View style={styles.editIconContainer}>
            <Icons.Pencil height={18} width={18} />
          </View>
          <Text style={styles.editActionText}>Edit Detail</Text>
        </TouchableOpacity>
      </View>

      {/* Visible card */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={account.gradientColors}
          style={styles.bankCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.bankLabelContainer}>
                <Text
                  style={[
                    styles.bankLabel,
                    {
                      backgroundColor: account.labelColor,
                      color: account.gradientColors[0],
                    },
                  ]}>
                  {account.bankName}
                </Text>
                <View style={styles.separator} />
                <Text style={styles.accountNumber}>
                  {account.accountNumber}
                </Text>
              </View>
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.accountInfo}>
                <Text style={styles.identifier}>{account.identifier}</Text>
                <Text style={styles.branch}>{account.branch}</Text>
              </View>

              <View style={styles.accountTypeContainer}>
                <Text style={styles.accountType}>{account.accountType}</Text>
              </View>
            </View>
          </View>

        </LinearGradient>
      </View>
    </SwipeRow>
  );

  const handleAddBank = () => {
    setIsAddBankModalVisible(true);
  };

  const handleSaveNewBank = newAccount => {
    setBankAccounts(prevAccounts => [...prevAccounts, newAccount]);
    setIsAddBankModalVisible(false);
  };

  return (
    <>
      <Header
        title="Bank Feeds"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {bankAccounts.map((account, index) => renderBankCard(account, index))}
        </ScrollView>
      </View>

      <CustomBottomButton buttonText="Add Bank" onPress={handleAddBank} />

      <EditBankModal
        visible={isEditModalVisible}
        onClose={handleCloseModal}
        bankAccount={selectedAccount}
        onSave={handleSaveAccount}
        onDelete={handleDeleteAccount}
        onDeleteClick={handleDeleteClick}
      />

      <AddBankModal
        visible={isAddBankModalVisible}
        onClose={() => setIsAddBankModalVisible(false)}
        onSave={handleSaveNewBank}
      />

      {/* Delete Confirmation Modal */}
      <CustomAnimatedModal
        visible={isDeleteModalVisible}
        onClose={handleCancelDelete}
        showCloseButton={false}
        statusBarTranslucent={true}>
        <View style={styles.deleteModalContainer}>
          {/* Icon */}
          <View style={styles.deleteIconContainer}>
            <Ionicons name="trash" size={32} color="#EF4444" />
          </View>

          {/* Title */}
          <Text style={styles.deleteModalTitle}>Delete Bank Account</Text>

          {/* Message */}

          <Text style={styles.deleteModalMessage}>
            Are you sure you want to delete this bank account? This action
            will permanently remove the account and its related transaction
            history from the system.
          </Text>

          {/* Action Buttons */}
          <View style={styles.deleteButtonContainer}>
            <TouchableOpacity
              style={styles.deleteConfirmButton}
              onPress={() => accountToDelete && handleDeleteAccount(accountToDelete)}>
              <Text style={styles.deleteConfirmButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteCancelButton}
              onPress={handleCancelDelete}>
              <Text style={styles.deleteCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomAnimatedModal>
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
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  /* FIXED — only this controls spacing */
  cardContainer: {
    marginTop: 10

  },
  bankCard: {
    marginTop: 0,
    borderRadius: 16,

    height: 160,   // unified height for iOS & Android
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bankLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  bankLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
    textAlignVertical: 'center',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  identifier: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,

  },
  branch: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',

  },
  accountType: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    borderRadius: 12,

  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,

  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F4F5FA',
    borderRadius: 16,
    paddingRight: 8,
    marginTop: 10
  },
  editActionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  editIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  deleteModalContainer: {
    borderRadius: 16,
    width: '100%',
  },
  deleteIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'left',
  },
  deleteModalMessage: {
    fontSize: 12,
    color: '#8F939E',
    textAlign: 'left',
    marginBottom: 20,
    paddingBottom: 2
  },
  deleteButtonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  deleteConfirmButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteConfirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteCancelButton: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteCancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BankFeeds;
