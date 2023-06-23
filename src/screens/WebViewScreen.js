import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';

const WebViewScreen = () => {
  return (
    <WebView
      source={{uri: 'https://reactnative.dev/'}}
      style={{flex: 1}}
      automaticallyAdjustsScrollIndicatorInsets={true}
      onLoadProgress={({nativeEvent}) => {
        console.log('1234', nativeEvent);
      }}
      onScroll={syntheticEvent => {
        const {contentOffset} = syntheticEvent.nativeEvent;
        console.log(contentOffset);
      }}
      startInLoadingState={true}
      renderLoading={() => (
        <ActivityIndicator
          color="blue"
          
          size="large"
          style={{position: 'absolute', top: '50%', left: '45%'}}
        />
      )}></WebView>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
