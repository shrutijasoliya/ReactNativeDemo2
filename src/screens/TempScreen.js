import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const TempScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TempScreen</Text>
    </View>
  );
};

export default TempScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  text: {color: 'black'},
});
