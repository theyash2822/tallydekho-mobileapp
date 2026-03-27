import React from 'react';
import {Text} from 'react-native';
import {globalStyles} from './Constants';

const createTextComponent =
  style =>
  ({children, fontSize, color, fontWeight, style: customStyle}) =>
    (
      <Text style={[style(fontSize), {color, fontWeight}, customStyle]}>
        {children}
      </Text>
    );

export const TextRegular = createTextComponent(globalStyles.textRegular);
export const TextBold = createTextComponent(globalStyles.textBold);
export const TextMedium = createTextComponent(globalStyles.textMedium);
export const TextSemibold = createTextComponent(globalStyles.textSemibold);
export const TextRegularItalic = createTextComponent(
  globalStyles.textRegularItalic,
);
export const TextBoldItalic = createTextComponent(globalStyles.textBoldItalic);
export const TextSemiboldItalic = createTextComponent(
  globalStyles.textSemiboldItalic,
);

//    <TextRegular>Hello World</TextRegular>
//    <TextBold fontSize={24}>This is Bold Text</TextBold>
//    <TextMedium fontSize={20}>This is Medium Text</TextMedium>
//    <TextSemibold fontSize={22}>This is Semibold Text</TextSemibold>
//    <TextRegularItalic fontSize={18}>This is Regular Italic Text</TextRegularItalic>
//    <TextBoldItalic fontSize={18}>This is Bold Italic Text</TextBoldItalic>
//    <TextSemiboldItalic fontSize={18}>This is Semibold Italic Text</TextSemiboldItalic>
//    Example to use them
