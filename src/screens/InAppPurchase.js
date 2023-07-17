import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import useInAppPurchase from '../customHooks/useInAppPurchase';

const InAppPurchase = () => {
  const {isFullAppPurchased, connectionErrMsg, purchaseFullApp} =
    useInAppPurchase();
  return (
    <View style={styles.container}>
      {isFullAppPurchased ? (
        <Text style={{...styles.msg, color: 'green'}}>
          Full app access available!!
        </Text>
      ) : null}

      <Button title="Purchase" onPress={purchaseFullApp} />
      {connectionErrMsg ? (
        <Text style={{...styles.msg, color: 'red'}}>{connectionErrMsg} </Text>
      ) : null}
    </View>
  );
};

export default InAppPurchase;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  msg: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
});
