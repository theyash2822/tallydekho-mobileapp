import React from 'react';
import {WebView} from 'react-native-webview';

export default function TallyDekhoWebView({route}) {
  return <WebView source={{uri: route.params.url}} style={{flex: 1}} />;
}
