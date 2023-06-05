import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageExp = () => {
  const myDetails = {
    firstName: 'Shruti',
    lastName: 'Jasoliya',
    age: 19,
    traits: {
      hair: 'black',
      eyes: 'blue',
    },
  };
  const [value, setValue] = useState('');

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('myName', jsonValue);
      console.log('success....1', value);
    } catch (error) {
      console.log('error...1', error);
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('myName');
      const data = jsonData != null ? JSON.parse(jsonData) : null;
      console.log('success....2', data);
      if (data != null) {
        setValue(data);
      }
    } catch (error) {
      console.log('error...2', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}>
      <Text>AsyncStorageExp</Text>
      <Button title="store data" onPress={() => storeData(myDetails)} />
      <Button title="get data" onPress={() => getData()} />
    </View>
  );
};

export default AsyncStorageExp;

const styles = StyleSheet.create({});
