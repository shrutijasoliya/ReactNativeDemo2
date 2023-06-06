import {Button, StyleSheet, Text, View} from 'react-native';
import React,{useState} from 'react';
import { i18n } from '../../App';
// import {I18n} from 'i18n-js/typings';
import {I18n} from 'i18n-js';

// const i18n = new I18n();

const WelcomeScreen = navigation => {
    const [first, setfirst] = useState(true)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {i18n.t('shruti')} {i18n.t('jasoliya')}
      </Text>
      <Button
        title="Change language"
        onPress={() => {
        //   navigation.navigate('LoginScreen');
        setfirst(!first);
        
        i18n.locale = first? 'gu':'en'
        }}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});
