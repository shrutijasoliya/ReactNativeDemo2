import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import {
  CardField,
  createToken,
  confirmPayment,
} from '@stripe/stripe-react-native';
import createPaymentIntent from '../apis/stripeApi';

const PaymentScreen = () => {
  const [cardDetails, setCardDetails] = useState(null);

  const fetchCardDetails = cardDetails => {
    if (cardDetails.complete) {
      setCardDetails(cardDetails);
    } else {
      setCardDetails(null);
    }
  };

  const onDoneHandler = async () => {
    let apiData = {
      amount: 100,
      currency: 'INR',
    };
    try {
      const res = await createPaymentIntent(apiData);
      console.log('payment intent created successfully.. ', res);

      if (res?.data?.paymentIntent) {
        let confirmPaymentIntent = await confirmPayment(res?.data?.paymentIntent, {
          paymentMethodType: 'Card',
        });
        console.log('confirmPaymentIntent response.. ', confirmPaymentIntent);
        Alert.alert('Payment done successfully!!');
      } else {
      }
    } catch (error) {
      console.log('error in api call--stripe', error);
    }
    // console.log('my card details ', cardDetails);
    // if (!!cardDetails) {
    //   try {
    //     const responseToken = await createToken({...cardDetails, type: 'Card'});
    //     console.log('created token ', responseToken);
    //   } catch (error) {
    //     console.log('error in create token', error);
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: 'white',
          textColor: 'black',
          placeholderColor: 'grey',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          fetchCardDetails(cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <Button title="Done" disabled={!cardDetails} onPress={onDoneHandler} />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, alignItems: 'center'},
});
