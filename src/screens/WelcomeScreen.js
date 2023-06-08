import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {i18n} from '../../App';
import {useNavigation} from '@react-navigation/native';

const WelcomeScreen = () => {
  const [changelanguage, setChangelanguage] = useState(true);
  const navigation = useNavigation();
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
