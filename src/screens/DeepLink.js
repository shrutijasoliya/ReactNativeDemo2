import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DeepLink = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>DeepLink</Text>
    </View>
  )
}

export default DeepLink

const styles = StyleSheet.create({ container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },})