import {Button, StyleSheet, Text, View, Alert, BackHandler} from 'react-native';
import React, {useState, useEffect} from 'react';
import {i18n} from '../../App';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const WelcomeScreen = () => {
  const [changelanguage, setChangelanguage] = useState(true);
  const navigation = useNavigation();

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
      {text: 'Cancel', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
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
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});
