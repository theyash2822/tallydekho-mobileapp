import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.94;
const CARD_SPACING = 12;

const SwipeableCards = ({
  cards,
  onCardPress,
  showPercentage = true,
  removeHorizontalPadding = false,
  autoScroll = true,
  autoScrollInterval = 3000,
  pauseOnTouch = true,
  loop = true,
  showIcon = true, 
}) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(1); // Start from index 1 (first real item)
  const scrollViewRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const autoScrollRef = useRef(null);

  const originalCards = cards || [
    {
      id: 1,
      title: 'Receivables',
      value: '₹10,00,000',
      icon: Icons.MoneyStack,
      screen: 'CashDetailScreen',
      label: 'Receivables',
      amount: '₹10,00,000',
      change: '+15%',
    },
    {
      id: 2,
      title: 'Payments',
      value: '₹25,50,000',
      icon: Icons.MoneyCard,
      screen: 'CashDetailScreen',
      label: 'Payments',
      amount: '₹25,50,000',
      change: '+8%',
    },
    {
      id: 3,
      title: 'Receipts',
      value: '₹18,75,000',
      icon: Icons.Receipt,
      screen: 'CashDetailScreen',
      label: 'Receipts',
      amount: '₹18,75,000',
      change: '+12%',
    },
    {
      id: 4,
      title: 'Payables',
      value: '₹12,30,000',
      icon: Icons.Payment,
      screen: 'CashDetailScreen',
      label: 'Payables',
      amount: '₹12,30,000',
      change: '-5%',
    },
    {
      id: 5,
      title: 'Bank Balances',
      value: '₹45,20,000',
      icon: Icons.CashStack,
      screen: 'CashDetailScreen',
      label: 'Bank Balances',
      amount: '₹45,20,000',
      change: '+22%',
    },
    {
      id: 6,
      title: 'Cash in Hand',
      value: '₹85,00,000',
      icon: Icons.Payment,
      screen: 'CashDetailScreen',
      label: 'Cash in Hand',
      amount: '₹85,00,000',
      change: '+18%',
    },
    {
      id: 7,
      title: 'Loans/ODs',
      value: '₹2,15,00,000',
      icon: Icons.MoneyFile,
      screen: 'CashDetailScreen',
      label: 'Loans/ODs',
      amount: '₹2,15,00,000',
      change: '+3%',
    },
  ];

  // Create infinite scroll effect by adding duplicate items
  // Add last item at beginning and first item at end for seamless looping
  const displayCards = useMemo(() => {
    if (!loop || originalCards.length <= 1) {
      return originalCards;
    }

    const lastItem = {
      ...originalCards[originalCards.length - 1],
      id: `clone-last-${originalCards[originalCards.length - 1].id}`,
    };
    const firstItem = {
      ...originalCards[0],
      id: `clone-first-${originalCards[0].id}`,
    };

    return [lastItem, ...originalCards, firstItem];
  }, [originalCards, loop]);

  // Get the real active index (excluding cloned items)
  const getRealActiveIndex = index => {
    if (!loop || originalCards.length <= 1) return index;

    if (index === 0) return originalCards.length - 1; // Last item clone
    if (index === displayCards.length - 1) return 0; // First item clone
    return index - 1; // Adjust for the clone at the beginning
  };

  const realActiveIndex = getRealActiveIndex(activeIndex);

  const handleCardPress = card => {
    console.log(`Navigating to ${card.screen} with label: ${card.label}`);

    if (onCardPress) {
      onCardPress(card);
    } else if (card.screen === 'CashDetailScreen') {
      navigation.navigate(card.screen, {
        label: card.label,
        amount: card.amount,
        change: card.change,
      });
    } else {
      navigation.navigate(card.screen);
    }
  };

  // Improved scroll to index with better position calculation
  const scrollToIndex = useCallback((index, animated = true) => {
    const cardWidth = CARD_WIDTH + CARD_SPACING;
    const x = index * cardWidth;
    scrollViewRef.current?.scrollTo({x, animated});
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (!autoScroll || originalCards.length <= 1 || isUserScrolling) return;

    // Clear any existing interval
    stopAutoScroll();

    autoScrollRef.current = setInterval(() => {
      if (!isPaused && !isUserScrolling) {
        setActiveIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }
    }, autoScrollInterval);
  }, [
    autoScroll,
    originalCards.length,
    isUserScrolling,
    isPaused,
    autoScrollInterval,
    scrollToIndex,
    stopAutoScroll,
  ]);

  // Handle scroll events - detect infinite scroll boundaries
  const handleMomentumScrollEnd = useCallback(
    event => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const cardWidth = CARD_WIDTH + CARD_SPACING;
      const index = Math.round(scrollPosition / cardWidth);
      const clampedIndex = Math.max(
        0,
        Math.min(index, displayCards.length - 1),
      );

      if (loop && originalCards.length > 1) {
        // Handle infinite scroll boundaries
        if (clampedIndex === 0) {
          // At first clone (last item), jump to real last item
          const realLastIndex = originalCards.length;
          setTimeout(() => {
            scrollToIndex(realLastIndex, false); // No animation for seamless transition
            setActiveIndex(realLastIndex);
          }, 50);
          return;
        } else if (clampedIndex === displayCards.length - 1) {
          // At last clone (first item), jump to real first item
          setTimeout(() => {
            scrollToIndex(1, false); // No animation for seamless transition
            setActiveIndex(1);
          }, 50);
          return;
        }
      }

      if (isUserScrolling) {
        setActiveIndex(clampedIndex);
      }
    },
    [
      displayCards.length,
      originalCards.length,
      isUserScrolling,
      loop,
      scrollToIndex,
    ],
  );

  // Handle when user starts scrolling
  const handleScrollBeginDrag = useCallback(() => {
    if (pauseOnTouch) {
      setIsUserScrolling(true);
      setIsPaused(true);
      stopAutoScroll();
    }
  }, [pauseOnTouch, stopAutoScroll]);

  // Handle when user stops scrolling
  const handleScrollEndDrag = useCallback(() => {
    if (pauseOnTouch) {
      // Add a delay before resuming auto-scroll
      setTimeout(() => {
        setIsUserScrolling(false);
        setIsPaused(false);
      }, 2100); // Increased delay to ensure smooth transition
    }
  }, [pauseOnTouch]);

  // Start auto-scroll on mount and when conditions change
  useEffect(() => {
    if (
      autoScroll &&
      !isPaused &&
      !isUserScrolling &&
      originalCards.length > 1
    ) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 500); // Small delay to ensure component is ready

      return () => {
        clearTimeout(timer);
        stopAutoScroll();
      };
    } else {
      stopAutoScroll();
    }
  }, [
    autoScroll,
    isPaused,
    isUserScrolling,
    originalCards.length,
    startAutoScroll,
    stopAutoScroll,
  ]);

  // Initialize scroll position to first real item
  useEffect(() => {
    if (loop && originalCards.length > 1) {
      // Set initial position to first real item (index 1)
      setTimeout(() => {
        scrollToIndex(1, false);
      }, 100);
    }
  }, [loop, originalCards.length, scrollToIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: removeHorizontalPadding ? 0 : 12},
        ]}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        snapToAlignment="center"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}>
        {displayCards.map((card, index) => (
          <TouchableOpacity
            key={card.id || `card-${index}`}
            style={[styles.card, index === activeIndex && styles.activeCard]}
            onPress={() => handleCardPress(card)}
            activeOpacity={0.8}>
            {/* Card Icon */}
            {showIcon && card.icon && (
              <View
                style={[styles.iconContainer, {backgroundColor: '#F4F5FA'}]}>
                <card.icon {...(card.iconSize || {width: 20, height: 20})} />
              </View>
            )}

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <View style={styles.valueSection}>
                <Text style={styles.cardValue}>{card.value}</Text>
                {showPercentage && card.change && (
                  <View
                    style={[
                      styles.changeIndicator,
                      {
                        backgroundColor: card.change.startsWith('+')
                          ? '#ECFDF5'
                          : '#FEE2E2',
                      },
                    ]}>
                    <Feather
                      name={
                        card.change.startsWith('+')
                          ? 'trending-up'
                          : 'trending-down'
                      }
                      size={10}
                      color={
                        card.change.startsWith('+') ? '#06A748' : '#EF4444'
                      }
                    />
                    <Text
                      style={[
                        styles.changeText,
                        {
                          color: card.change.startsWith('+')
                            ? '#06A748'
                            : '#EF4444',
                        },
                      ]}>
                      {card.change}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  scrollContent: {
    // Base styles for scrollContent
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: CARD_SPACING,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCard: {
    borderColor: Colors.border,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  valueSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activePaginationDot: {
    backgroundColor: '#10B981',
    width: 8,
  },
  autoScrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 6,
  },
  autoScrollDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  pausedDot: {
    backgroundColor: '#F59E0B',
  },
  autoScrollText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default SwipeableCards;
