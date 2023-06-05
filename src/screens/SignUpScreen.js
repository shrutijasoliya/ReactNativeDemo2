import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SignUpScreen = ({route}) => {
  const {username, password} = route.params.userDetails;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {username}  {password}
      </Text>
    </View>
  );
};

export default SignUpScreen;

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
