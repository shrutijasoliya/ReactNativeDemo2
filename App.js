import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18n} from 'i18n-js';
// import i18n from 'i18';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import {AuthContext} from './src/context/authContext';
import {en} from './src/locals/en';
import {gu} from './src/locals/gu';

const Stack = createStackNavigator();
// const authContext = useContext(AuthContext);

const i18n = new I18n();
i18n.enableFallback = true;
i18n.translations = {en, gu};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    console.log('context vale: signedIn....', authState.signedIn);
  }, []);

  const [authState, setAuthState] = useState({signedIn: false});
  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      <NavigationContainer>
        {authState.signedIn ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
export {i18n};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
