import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import {View, Text, Image, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';

const SyncScrollable = () => {
  const {width} = Dimensions.get('window');
  const BANNER_WIDTH = width * 0.92;
  const BANNER_SPACING = 18;
  const originalBanners = [1, 2, 3, 4]; // Original banner items

  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1); // Start from index 1 (first real item)
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const autoScrollRef = useRef(null);

  // Create infinite scroll data by adding duplicates
  const displayBanners = useMemo(() => {
    if (originalBanners.length <= 1) return originalBanners;

    // Add last item at beginning and first item at end for seamless looping
    const lastItem = originalBanners[originalBanners.length - 1];
    const firstItem = originalBanners[0];

    return [lastItem, ...originalBanners, firstItem];
  }, [originalBanners]);

  // Get the real active index (excluding cloned items)
  const getRealActiveIndex = index => {
    if (originalBanners.length <= 1) return index;

    if (index === 0) return originalBanners.length - 1; // Last item clone
    if (index === displayBanners.length - 1) return 0; // First item clone
    return index - 1; // Adjust for the clone at the beginning
  };

  const realActiveIndex = getRealActiveIndex(activeIndex);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index, animated = true) => {
      const bannerWidth = BANNER_WIDTH + BANNER_SPACING;
      const x = index * bannerWidth;
      scrollViewRef.current?.scrollTo({x, animated});
    },
    [BANNER_WIDTH, BANNER_SPACING],
  );

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (originalBanners.length <= 1 || isUserScrolling || isPaused) return;

    // Clear any existing interval
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    autoScrollRef.current = setInterval(() => {
      if (!isPaused && !isUserScrolling) {
        setActiveIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          scrollToIndex(nextIndex, true);
          return nextIndex;
        });
      }
    }, 4000); // Increased interval from 3000 to 4000ms (4 seconds)
  }, [originalBanners.length, isUserScrolling, isPaused, scrollToIndex]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  // Handle scroll boundaries for infinite effect
  const handleMomentumScrollEnd = useCallback(
    event => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const bannerWidth = BANNER_WIDTH + BANNER_SPACING;
      const index = Math.round(scrollPosition / bannerWidth);
      const clampedIndex = Math.max(
        0,
        Math.min(index, displayBanners.length - 1),
      );

      if (originalBanners.length > 1) {
        // Handle infinite scroll boundaries
        if (clampedIndex === 0) {
          // At first clone (last item), jump to real last item
          const realLastIndex = originalBanners.length;
          setTimeout(() => {
            scrollToIndex(realLastIndex, false); // No animation for seamless transition
            setActiveIndex(realLastIndex);
          }, 50);
          return;
        } else if (clampedIndex === displayBanners.length - 1) {
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
      displayBanners.length,
      originalBanners.length,
      scrollToIndex,
      BANNER_WIDTH,
      BANNER_SPACING,
      isUserScrolling,
    ],
  );

  // Handle user scroll start
  const handleScrollBeginDrag = useCallback(() => {
    setIsUserScrolling(true);
    setIsPaused(true);
    stopAutoScroll();
  }, [stopAutoScroll]);

  // Handle user scroll end
  const handleScrollEndDrag = useCallback(() => {
    // Resume auto-scroll after a longer delay
    setTimeout(() => {
      setIsUserScrolling(false);
      setIsPaused(false);
    }, 1500); // Reduced delay for better responsiveness
  }, []);

  // Start auto-scroll when component mounts or conditions change
  useEffect(() => {
    if (!isPaused && !isUserScrolling && originalBanners.length > 1) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 500); // Reduced delay for quicker start

      return () => {
        clearTimeout(timer);
        stopAutoScroll();
      };
    } else {
      stopAutoScroll();
    }
  }, [
    isPaused,
    isUserScrolling,
    originalBanners.length,
    startAutoScroll,
    stopAutoScroll,
  ]);

  // Initialize scroll position to first real item
  useEffect(() => {
    if (originalBanners.length > 1) {
      // Set initial position to first real item (index 1)
      setTimeout(() => {
        scrollToIndex(1, false);
      }, 200); // Reduced delay for quicker initialization
    }
  }, [originalBanners.length, scrollToIndex]);

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
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        snapToInterval={BANNER_WIDTH + BANNER_SPACING}
        decelerationRate="fast"
        snapToAlignment="center"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}>
        {displayBanners.map((item, index) => (
          <View
            key={`banner-${item}-${index}`}
            style={[
              styles.bannerContainer,
              {width: BANNER_WIDTH, marginRight: BANNER_SPACING},
            ]}>
            <View style={styles.syncBanner}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.syncLogo}
              />
              <View style={styles.syncTextContainer}>
                <Text style={styles.syncText}>
                  Sync your account with Tally!
                </Text>
                <Text style={styles.syncSubText}>
                  Sync for seamless management
                </Text>
              </View>
              {/* <Icon name="chevron-right" size={24} color="#fff" /> */}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Spacer to push dots down */}
      {/* <View style={{height: 20}} /> */}

      {/* Indicator Dots BELOW the banner - only show original items */}
      {/* <View style={styles.indicatorContainer}>
        {originalBanners.map((_, index) => {
          // Calculate opacity based on real active index
          const isActive = index === realActiveIndex;

          return (
            <View
              key={`indicator-${index}`}
              style={[
                styles.indicator,
                {
                  opacity: isActive ? 1 : 0.4,
                  backgroundColor: isActive ? '#009688' : '#C0C0C0',
                },
              ]}
            />
          );
        })}
      </View> */}
    </View>
  );
};

const styles = {
  container: {alignItems: 'center'},
  scrollContent: {
    paddingHorizontal: 12,
  },
  bannerContainer: {
    // Width and marginRight are set inline
  },
  syncBanner: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 0.1,
  },
  syncLogo: {width: 24, height: 24, marginRight: 10},
  syncTextContainer: {flex: 1},
  syncText: {color: Colors.white, fontWeight: 'bold'},
  syncSubText: {color: Colors.white},

  // Indicator styles
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    width: 88,
    height: 3,
    backgroundColor: '#009688',
    marginHorizontal: 4,
  },
};

export default SyncScrollable;
