import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

/**
 * CustomAnimatedModal - Reusable modal with smooth fade + slide animations
 * 
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title (optional)
 * @param {boolean} showCloseButton - Show close button in header (default: true)
 * @param {node} children - Modal content
 * @param {object} contentStyle - Additional styles for modal content
 * @param {number} animationDuration - Animation duration in ms (default: 300)
 * @param {boolean} useSpring - Use spring animation for slide (default: true)
 * @param {number} tension - Spring tension (default: 50)
 * @param {number} friction - Spring friction (default: 10)
 * @param {boolean} scrollable - Wrap children in ScrollView (default: false)
 * @param {string} overlayColor - Background overlay color (default: rgba(0,0,0,0.25))
 * @param {number} maxHeight - Max height percentage (default: '90%')
 */
const CustomAnimatedModal = ({
  visible,
  onClose,
  title,
  showCloseButton = true,
  children,
  contentStyle,
  animationDuration = 300,
  useSpring = true,
  tension = 50,
  friction = 10,
  scrollable = false,
  overlayColor = 'rgba(0,0,0,0.25)',
  maxHeight = '90%',
  statusBarTranslucent = false,
}) => {
  // Internal state to control actual Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current; // background opacity
  const slideAnim = useRef(new Animated.Value(300)).current; // modal translateY

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true); // show modal first

      // Reset animations to initial state immediately
      fadeAnim.setValue(0);
      slideAnim.setValue(300);

      // Use a small timeout to ensure Modal is mounted, then start animation immediately
      const timeoutId = setTimeout(() => {
      const slideAnimation = useSpring
        ? Animated.spring(slideAnim, {
            toValue: 0,
              tension: tension,
              friction: friction,
            useNativeDriver: true,
          })
        : Animated.timing(slideAnim, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          });

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        slideAnimation,
      ]).start();
      }, 10); // Minimal delay to ensure Modal is mounted

      return () => clearTimeout(timeoutId);
    } else {
      // animate out first
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false); // hide modal after animation
      });
    }
  }, [visible, fadeAnim, slideAnim, animationDuration, useSpring, tension, friction]);

  if (!isModalVisible) return null;

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled',
      }
    : {};

  return (
    <Modal
      visible={isModalVisible}
      animationType="none"
      transparent
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {backgroundColor: overlayColor, opacity: fadeAnim},
          ]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {transform: [{translateY: slideAnim}], maxHeight},
                contentStyle,
              ]}>
              {/* Header */}
              {(title || showCloseButton) && (
                <View style={styles.headerRow}>
                  {title && <Text style={styles.title}>{title}</Text>}
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                      <Icon name="close" size={24} color={Colors.secondaryText} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <ContentWrapper {...contentWrapperProps}>
                {children}
              </ContentWrapper>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F4F5FA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    padding: 12,
    overflow: 'hidden', // prevents flicker at corners
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
});

export default CustomAnimatedModal;

