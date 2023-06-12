import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import SQLite from 'react-native-sqlite-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import BgLogin from './../../assets/images/BgLogin.png';
import IcUsername from './../../assets/images/ic_username.png';
import IcEmail from './../../assets/images/ic_email.png';
import IcPassword from './../../assets/images/ic_password.png';

const validationSchema = Yup.object({
  username: Yup.string().trim().required('Username is required!'),
  emailId: Yup.string()
    .email('EmailId is not valid.')
    .required('EmailId is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});
const userInfo = {username: '', emailId: '', password: ''};

const SignUpScreen = ({navigation}) => {
  const createFirebaseUser = (uname, email, pass) => {
    auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(response => {
        console.log(
          '11... user created successfully!!',
          JSON.stringify(response),
        );
        saveUserToFirebase(response.user.uid, uname, email, pass);
        Alert.alert('User created successfully!!');
        navigation.navigate('LoginScreen');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('11... That email address is already in use!');
          Alert.alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('11... That email address is invalid!');
          Alert.alert('That email address is invalid!');
        }
        console.error('11...error in signup... ', error);
      });
  };

  const saveUserToFirebase = (userUid, uname, email, pass) => {
    console.log('qiurgfyesdjxz', userUid);
    firestore()
      .collection('User')
      .doc(userUid)
      .set({userName: uname, userEmai: email, Password: pass})
      .then(res => {
        console.log('123456789... user saved to firestore', res);
      });
  };

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={(values, formikActions) => {
        console.log('11111', values);
        setTimeout(() => {
          formikActions.resetForm();
          var uname = values.username;
          var email = values.emailId;
          var pass = values.password;
          console.log('......1', uname, email, pass);
          createFirebaseUser(uname, email, pass);
          //   setDataToSQL(uname, pass);
        }, 1000);
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
        const {username, emailId, password} = values;
        return (
          <View>
            <ImageBackground
              source={BgLogin}
              resizeMode="stretch"
              style={{height: '100%', width: '100%'}}>
              <View style={styles.signupContainer}>
                {/* username */}
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
                {/* email */}
                <View style={styles.userInputStyle}>
                  <View style={{flex: 1}}>
                    <Image
                      source={IcEmail}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: 'grey',
                      }}
                    />
                  </View>
                  <TextInput
                    textContentType="emailAddress"
                    value={emailId}
                    onChangeText={handleChange('emailId')}
                    onBlur={handleBlur('emailId')}
                    placeholderTextColor="grey"
                    placeholder="Enter EmailId"
                    style={{height: 40, flex: 8, color: 'black'}}
                  />
                  {touched.emailId && errors.emailId ? (
                    <Text style={{color: 'red'}}>
                      {touched.emailId && errors.emailId}
                    </Text>
                  ) : null}
                </View>
                {/* password */}
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
                {/* SignUp */}
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
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    bottom: 0,
                  }}
                  onPress={() => {
                    navigation.navigate('LoginScreen');
                  }}>
                  <Text style={styles.textCommon}>
                    Already have an account?
                  </Text>
                  <Text style={{color: '#47c153', fontWeight: '800'}}>
                    {' '}
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        );
      }}
    </Formik>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  signupContainer: {
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
  textCommon: {
    color: 'black',
  },
});
