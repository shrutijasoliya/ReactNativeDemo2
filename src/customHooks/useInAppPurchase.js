import {StyleSheet, Text, View, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import {requestPurchase, useIAP} from 'react-native-iap';

import {
  STORAGE_KEYS,
  storeBooleanData,
  getBooleanData,
} from '../screens/AsyncStorageExp';

const {IS_FULL_APP_PURCHASED} = STORAGE_KEYS;

//playstore item ids
const itemSKUs = Platform.select({android: ['test1']});

console.log('jghbhejwfklmdsal,', itemSKUs);
const useInAppPurchase = () => {
  const [isFullAppPurchased, setIsFullAppPurchased] = useState(false);
  const [connectionErrMsg, setConnectionErrMsg] = useState('');

  const {
    connected,
    products,
    getProducts,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  useEffect(() => {
    getBooleanData(IS_FULL_APP_PURCHASED).then(data => {
      console.log('isFullAppPurchased: ', data);
      setIsFullAppPurchased(data);
    });
  }, []);

  // Get products from play store.
  useEffect(() => {
    if (connected) {
      getProducts(itemSKUs);
      console.log('Getting products...');
    }
    console.log(products);
  }, [connected, getProducts]);

  // currentPurchase will change when the requestPurchase function is called. The purchase then needs to be checked and the purchase acknowledged so Google knows we have awared the user the in-app product.
  useEffect(() => {
    const checkCurrentPurchase = async purchase => {
      if (purchase) {
        const receipt = purchase.transactionReceipt;
        console.log('RECEIPT: ', receipt);
        if (receipt) {
          // Give full app access
          setAndStoreFullAppPurchase(true);
          try {
            const ackResult = await finishTransaction(purchase);
            console.log('ackResult: ', ackResult);
          } catch (ackErr) {
            // We would need a backend to validate receipts for purhcases that pended for a while and were then declined. So I'll assume most purchase attempts go through successfully (OK ackResult) & take the hit for the ones that don't (user will still have full app access).
            console.log('ackError: ', ackErr);
          }
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  // If user reinstalls app, then they can press purchase btn (SettingsScreen) to get full app without paying again.
  useEffect(() => {
    if (currentPurchaseError) {
      if (
        currentPurchaseError.code === 'E_ALREADY_OWNED' &&
        !isFullAppPurchased
      ) {
        setAndStoreFullAppPurchase(true);
      }
    }
  }, [currentPurchaseError]);

  const purchaseFullApp = async () => {
    // Reset error msg
    if (connectionErrMsg !== '') setConnectionErrMsg('');
    if (!connected) {
      setConnectionErrMsg('Please check your internet connection');
    }
    // If we are connected & have products, purchase the item. Google will handle if user has no internet here.
    else if (products?.length > 0) {
      requestPurchase(itemSKUs[1]);
      console.log('Purchasing products...');
    }
    // If we are connected but have no products returned, try to get products and purchase.
    else {
      console.log('No products. Now trying to get some...');
      try {
        await getProducts(itemSKUs);
        requestPurchase(itemSKUs[1]);
        console.log('Got products, now purchasing...');
      } catch (error) {
        setConnectionErrMsg('Please check your internet connection');
        console.log('Everything failed. Error: ', error);
      }
    }
  };

  const setAndStoreFullAppPurchase = boolean => {
    setIsFullAppPurchased(boolean);
    storeBooleanData(IS_FULL_APP_PURCHASED, boolean);
    console.log(`Set and stored full app purchase: `, boolean);
  };

  return {isFullAppPurchased, connectionErrMsg, purchaseFullApp};
};

export default useInAppPurchase;

const styles = StyleSheet.create({});
