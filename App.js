import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18n} from 'i18n-js';
import messaging from '@react-native-firebase/messaging';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DeepLink from './src/screens/DeepLink';
import MapViewScreen from './src/screens/MapViewScreen';
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
      <Stack.Screen name="DeepLink" component={DeepLink} />
      <Stack.Screen name="MapViewScreen" component={MapViewScreen} />
    </Stack.Navigator>
  );
};

const registerAppWithFCM = async () => {
  // if (!messaging().isDeviceRegisteredForRemoteMessages) {
  const abc = await messaging().getToken();
  console.log('fcmtoken...', abc);
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  return unsubscribe;
  // }
};

const pushNotification = () => {
  console.log('push notification ....');
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // ios
      // notification.finish(PushNotification.FetchResult.NoData);
    },

    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // popInitialNotification: true,

    // requestPermissions: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

const createChannelForPushNotification = () => {
  console.log('creating channel for push notification...');
  PushNotification.createChannel(
    {
      channelId: 'channel-id-test',
      channelName: 'My Test channel',
      channelDescription: 'A channel to categorise your notifications',
      playSound: true,
      soundName: 'default',
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`),
  );
};

// const pushNotificationLocalExp = () => {
//   console.log('local push notification coming....');

//   PushNotification.localNotification({
//     id: 0,
//     title: 'My notification title',
//     message: 'My notification message',
//     picture:
//       'https://upload.wikimedia.org/wikipedia/commons/5/53/Domain_Examples.jpg',
//     playSound: false,
//     soundName: 'default',
//     repeatType: 'minute',
//     repeatTime: 3,
//   });
// };

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    console.log('context vale: signedIn....', authState.signedIn);
    // registerAppWithFCM();
    pushNotification();
    createChannelForPushNotification();
    // pushNotificationLocalExp();
  }, []);

  const [authState, setAuthState] = useState({signedIn: false});
  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      <NavigationContainer>
        <AppStack/>
        {/* {authState.signedIn ? <AppStack /> : <AuthStack />} */}
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
