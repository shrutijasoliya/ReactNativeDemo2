import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React,{useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text
          ellipsizeMode="middle"
          numberOfLines={1}
          style={{color: 'white', width: 50}}>
          Shruti Jasoliya
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
