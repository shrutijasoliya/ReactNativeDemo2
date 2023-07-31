import {Button, StyleSheet, Text, View, Alert, BackHandler} from 'react-native';
import React, {useState, useEffect} from 'react';
import {i18n} from '../../App';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const WelcomeScreen = () => {
  const [changelanguage, setChangelanguage] = useState(true);
  const [isNetConnected, setIsNetConnected] = useState('');
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
      {text: 'Cancel', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  const showErrorNetworkMessage = () => {
    showMessage({
      message: 'Internet is not connected!!',
      backgroundColor: 'red',
    });
  };

  const showSuccessNetworkMessage = () => {
    showMessage({message: 'Internet is connected!!', backgroundColor: 'green'});
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => {
        backHandler.remove();
      };
    }, []),
  );

  useEffect(() => {
    console.log('net info : ', netInfo);
    console.log('is net connected ? : ', netInfo.isConnected?.toString());
    setIsNetConnected(netInfo.isConnected?.toString());
    isNetConnected ? showSuccessNetworkMessage() : showErrorNetworkMessage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{i18n.t('welcome')}</Text>
      <Button
        title="Change language"
        onPress={() => {
          setChangelanguage(!changelanguage);
          i18n.locale = changelanguage ? 'gu' : 'en';
        }}
      />
      <Button
        title="Get Started"
        onPress={() => {
          navigation.navigate('HomeScreen');
        }}
      />
      <FlashMessage />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
});
