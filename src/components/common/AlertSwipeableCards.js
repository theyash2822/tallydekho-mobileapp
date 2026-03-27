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
import BuyCreditModal from '../settings/AccountAndOrganizations/Components/BuyCreditModal';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.94;
const CARD_SPACING = 12;

const AlertSwipeableCards = ({
  cards,
  onCardPress,
  removeHorizontalPadding = false,
  autoScroll = true,
  autoScrollInterval = 5000,
  pauseOnTouch = true,
  loop = true,
  showAutoScrollIndicator = false,
}) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(1); // Start from index 1 (first real item)
  const scrollViewRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const autoScrollRef = useRef(null);
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false);
  const [selectedCreditOption, setSelectedCreditOption] = useState('500');

  // Use provided cards or fallback to default alert cards
  const originalCards = cards || [
    {
      id: '1',
      type: 'warning',
      title: '14 invoices',
      message: 'due for IRN generation',
      buttonText: 'Generate now',
      priority: 'high',
      icon: 'alert-triangle',
      action: () => navigation.navigate('EWayBill'),
    },
    {
      id: '2',
      type: 'warning',
      title: 'Credits left: 28',
      message: '',
      buttonText: 'Buy Now',
      priority: 'medium',
      icon: 'alert-triangle',
      action: () => console.log('Navigate to buy credits'),
    },
    {
      id: '3',
      type: 'info',
      title: '10 invoices',
      message: 'due for E-Invoice generation',
      buttonText: 'Generate Now',
      priority: 'low',
      icon: 'alert-triangle',
      action: () => navigation.navigate('EInvoicesList'),
    },
  ];

  // Create infinite scroll effect by adding duplicate items
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
  const getRealActiveIndex = useCallback(
    index => {
      if (!loop || originalCards.length <= 1) return index;

      if (index === 0) return originalCards.length - 1; // Last item clone
      if (index === displayCards.length - 1) return 0; // First item clone
      return index - 1; // Adjust for the clone at the beginning
    },
    [loop, originalCards.length, displayCards.length],
  );

  const realActiveIndex = getRealActiveIndex(activeIndex);

  const handleCardPress = useCallback(
    card => {
      console.log(`Alert card pressed: ${card.title}`);

      if (onCardPress) {
        onCardPress(card);
      } else if (card.buttonText === 'Buy Now') {
        setShowBuyCreditModal(true);
      } else if (
        card.buttonText === 'Generate now' ||
        card.buttonText === 'Generate Now'
      ) {
        // Navigate to respective screens based on card action
        if (card.action) {
          card.action();
        }
      } else if (card.action) {
        card.action();
      }
    },
    [onCardPress],
  );

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
      }, 1500); // Increased delay to ensure smooth transition
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
      {/* Cards Container */}
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
          <View
            key={card.id || `card-${index}`}
            style={[styles.card, index === activeIndex && styles.activeCard]}>
            <View style={styles.cardContent}>
              {/* Alert Icon */}
              <View style={styles.alertIconContainer}>
                <Feather name="alert-triangle" size={20} color="#fff" />
              </View>

              {/* Text Content */}
              <View style={styles.textContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                {card.message ? (
                  <Text style={styles.cardMessage}>{card.message}</Text>
                ) : null}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCardPress(card)}>
                <Text style={styles.actionButtonText}>{card.buttonText}</Text>
                <Feather name="chevron-right" size={14} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {/* <View style={styles.paginationContainer}>
        {originalCards.map((card, index) => (
          <TouchableOpacity
            key={`pagination-${card.id || index}`}
            style={[
              styles.paginationDot,
              index === realActiveIndex && styles.activePaginationDot,
            ]}
            onPress={() => {
           
              stopAutoScroll();
              setIsPaused(true);
              setIsUserScrolling(true);

            
              const targetIndex =
                loop && originalCards.length > 1 ? index + 1 : index;

          
              scrollToIndex(targetIndex);
              setActiveIndex(targetIndex);

            
              setTimeout(() => {
                setIsUserScrolling(false);
                setIsPaused(false);
              }, 2500);
            }}
          />
        ))}

      
        {autoScroll && showAutoScrollIndicator && originalCards.length > 1 && (
          <View style={styles.autoScrollIndicator}>
            <View
              style={[
                styles.autoScrollDot,
                (isPaused || isUserScrolling) && styles.pausedDot,
              ]}
            />
            <Text style={styles.autoScrollText}>
              {isPaused || isUserScrolling ? 'Paused' : 'Auto-scroll'}
            </Text>
          </View>
        )}
      </View> */}

      {/* Buy Credit Modal */}
      <BuyCreditModal
        visible={showBuyCreditModal}
        onClose={() => setShowBuyCreditModal(false)}
        selectedCreditOption={selectedCreditOption}
        onCreditOptionSelect={setSelectedCreditOption}
        onBuyNow={() => {
          console.log('Buy credits clicked');
          setShowBuyCreditModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginTop: 16,
  },
  scrollContent: {
    // Base styles for scrollContent
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#EF6163',
    borderRadius: 16,
    padding: 12,
    marginRight: CARD_SPACING,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 55,
  },
  activeCard: {
    borderColor: Colors.border,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  cardMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  actionButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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

export default AlertSwipeableCards;
