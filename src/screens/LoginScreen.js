import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import SQLite from 'react-native-sqlite-storage';

import BgLogin from './../../assets/images/BgLogin.png';
import IcUsername from './../../assets/images/ic_username.png';
import IcPassword from './../../assets/images/ic_password.png';

const db = SQLite.openDatabase(
  {
    name: 'TestDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log('000000', error);
  },
);

const validationSchema = Yup.object({
  username: Yup.string().trim().required('Username is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

const LoginScreen = ({navigation}) => {

  const createTable=()=>{
    db.transaction(tx=>{
      
    })
  }

  const userInfo = {username: '', password: ''};
  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={(values, formikActions) => {
        console.log('11111', values);
        setTimeout(() => {
          formikActions.resetForm();
          navigation.navigate('SignUpScreen', {userDetails: values});
        }, 1000);
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
        const {username, password} = values;
        return (
          <View>
            <ImageBackground
              source={BgLogin}
              resizeMode="stretch"
              style={{height: '100%', width: '100%'}}>
              <View style={styles.loginContainer}>
                <View style={styles.userInputStyle}>
                  <View style={{flex: 1}}>
                    <Image
                      source={IcUsername}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: 'grey',
                      }}
                    />
                  </View>
                  <TextInput
                    textContentType="name"
                    value={username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    placeholderTextColor="grey"
                    placeholder="Enter Username"
                    style={{height: 40, flex: 8, color: 'black'}}
                  />
                  {touched.username && errors.username ? (
                    <Text style={{color: 'red'}}>
                      {touched.username && errors.username}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.userInputStyle}>
                  <View style={{flex: 1}}>
                    <Image
                      source={IcPassword}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: 'grey',
                      }}
                    />
                  </View>
                  <TextInput
                    secureTextEntry={true}
                    value={password}
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    placeholderTextColor="grey"
                    placeholder="Enter Password"
                    style={{height: 40, flex: 8, color: 'black'}}
                  />
                  {touched.password && errors.password ? (
                    <Text style={{color: 'red'}}>
                      {touched.password && errors.password}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: '#47c153',
                    borderRadius: 20,
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      paddingVertical: 12,
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                      letterSpacing: 1,
                      elevation: 5,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                bottom: 0,
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={{color:'black'}}>Go back to first page</Text>
            </TouchableOpacity> */}
              </View>
            </ImageBackground>
          </View>
        );
      }}
    </Formik>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginContainer: {
    marginStart: Platform.OS === 'ios' ? 28 : 30,
    height: '48%',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 27,
    bottom: 0,
    position: 'absolute',
    paddingHorizontal: 30,
    marginBottom: Platform.OS === 'ios' ? 45 : 52,
  },
  userInputStyle: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
