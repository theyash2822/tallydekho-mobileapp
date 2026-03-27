import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {TextSemibold} from '../../utils/CustomText';
import Colors from '../../utils/Colors';

const iconSets = {
  Feather,
  Ionicons,
  // Add other icon sets here if needed
};

const Header = ({
  title,
  leftIcon,
  leftIconType = 'Feather',
  rightIcon,
  rightIconType = 'Feather',
  onLeftPress,
  onRightPress,
  rightIconColor = '#8F939E',
  leftIconColor = '#8F939E',
  style,
  hideBottomBorder = false,
  rightIcon2,
  rightIcon2Type = 'Feather',
  onRightPress2,
  rightIcon2Color = '#8F939E',
  rightText = false,
  rightTextStyle,
  leftIconSize = 24,
  rightIconSize = 24,
  rightIcon2Size = 24,

  showBackgroundContainer = false,
}) => {
  const navigation = useNavigation();

  const LeftIconComponent = iconSets[leftIconType] || Feather;
  const RightIconComponent = iconSets[rightIconType] || Feather;
  const RightIconComponent2 = iconSets[rightIcon2Type] || Feather;

  // helper for rendering right icons (string = vector-icon, component = svg)
  const renderRightIcon = (icon, IconComponent, color, onPress, size) => {
    if (!icon) return null;

    const iconElement =
      typeof icon === 'string' ? (
        <IconComponent name={icon} size={size} color={color} />
      ) : (
        (() => {
          const SvgIcon = icon;
          return <SvgIcon width={size} height={size} fill={color} />;
        })()
      );

    return (
      <TouchableOpacity onPress={onPress} style={styles.iconTouchable}>
        {showBackgroundContainer ? (
          <View style={[styles.iconBackground]}>{iconElement}</View>
        ) : (
          iconElement
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.header, !hideBottomBorder && styles.headerBorder, style]}>
      <View style={styles.leftIconContainer}>
        <TouchableOpacity
          onPress={
            onLeftPress
              ? onLeftPress
              : () => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    try {
                      navigation.navigate('MainTabs', {screen: 'dashboard'});
                    } catch (error) {
                      console.warn('Navigation fallback failed:', error);
                    }
                  }
                }
          }>
          <LeftIconComponent
            name={leftIcon} 
            size={leftIconSize}
            color={leftIconColor}
          />
        </TouchableOpacity>
      </View>

      <TextSemibold
        style={styles.headerTitle}
        fontSize={18}
        color={'#494D58'}
        fontWeight="600">
        {title}
      </TextSemibold>

      <View style={styles.rightIconContainer}>
        {rightText ? (
          <Text style={[styles.rightText, rightTextStyle]}>{rightText}</Text>
        ) : null}

        {renderRightIcon(
          rightIcon,
          RightIconComponent,
          rightIconColor,
          onRightPress,
          rightIconSize,
        )}

        {renderRightIcon(
          rightIcon2,
          RightIconComponent2,
          rightIcon2Color,
          onRightPress2,
          rightIcon2Size,
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    textAlign: 'center',
    flex: 1,
    color:"#000"
  },
  rightIconContainer: {
    flexDirection: 'row',
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  rightText: {
    fontSize: 10,
    color: '#494D58',
  },
  leftIconContainer: {
    minWidth: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconTouchable: {
    marginLeft: 1,
  },
  iconBackground: {
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: '#F6F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
