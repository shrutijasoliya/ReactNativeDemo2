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
import React, {useState, useEffect, useContext} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import SQLite from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';
import Svg, {Circle} from 'react-native-svg';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import {AuthContext} from '../context/authContext';

import BgLogin from './../../assets/images/BgLogin.png';
import IcEmail from './../../assets/images/ic_email.png';
import IcPassword from './../../assets/images/ic_password.png';
// import IcApple from './../../assets/images/ic_apple.png';
import SvgComponent from '../../assets/images/ic_apple_svg';
import IcGoogle from '../../assets/images/ic_google.png';
import IcFacebook from '../../assets/images/ic_facebook.png';

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
  emailId: Yup.string()
    .email('EmailId is not valid.')
    .required('EmailId is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [authState, setAuthState] = useContext(AuthContext);
  // const [profileImg, setProfileImg] = useState('');

  useEffect(() => {
    // createTable();
    // getDataFromSQL();
    GoogleSignin.configure({
      androidClientId:
        '758768894775-aa1got3siknfr50qg3vp4m9ir5qm46jd.apps.googleusercontent.com',
    });
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS UserDetails (ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password Text);',
      );
    });
  };

  const setDataToSQL = async (username, password) => {
    console.log('......2', username, password);
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO UserDetails(Username, Password) VALUES (?,?)',
        [username, password],
      );
    });
  };

  const getDataFromSQL = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Username, Password FROM UserDetails',
        [],
        (tx, results) => {
          console.log('......3', results.rows.item(0));
          var length = results.rows.length;
          if (length > 0) {
            navigation.navigate('HomeScreen');
          }
        },
      );
    });
  };

  const userInfo = {emailId: '', password: ''};

  const signInWithEmailPass = (email, pass, resetForm) => {
    auth()
      .signInWithEmailAndPassword(email, pass)
      .then(response => {
        console.log('12... logged in successfully!!', JSON.stringify(response));
        console.log('Logged in successfully!');
        setAuthState({signedIn: true});
        resetForm();
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          console.log('12... The password is wrong!');
          Alert.alert('The password is wrong!');
        }

        if (error.code === 'auth/user-not-found') {
          console.log('12... This user is not found!');
          Alert.alert('This user is not found!');
        }
        console.error('12...error in login... ', error);
      });
  };

  const signInWithApple = () => {};

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      let user = await GoogleSignin.signIn();
      console.log('13..... signin with google successed! ', user);
      setAuthState({signedIn: true});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('13..... signin with google error ', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('13.....signin with google error ', error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('13.....signin with google error ', error);
      } else {
        // some other error happened
        console.log('13.....signin with google error ', error);
      }
    }
  };

  const addUserToFirebase = async data => {
    try {
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      console.log('facebook credential... ', facebookCredential);
      const signedIn = await auth().signInWithCredential(facebookCredential);
      console.log('signed in successfully with.... ', signedIn);
      setAuthState({signedIn: true});
    } catch (error) {
      console.log('error while adding user to firebase ... ', error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
      const data = await AccessToken.getCurrentAccessToken();

      console.log('access token.. ', data.accessToken.toString());

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      // const currentProfile = await Profile.getCurrentProfile();
      // console.log('current profile... ', currentProfile);

      // Create a Firebase credential with the AccessToken
      addUserToFirebase(data);
    } catch (error) {
      console.log('error while login with facebook ... ', error);
    }
  };

  return (
    // <KeyboardAvoidingScrollView >
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={(values, formikActions) => {
        console.log('11111', values);
        setTimeout(() => {
          // formikActions.resetForm();
          var email = values.emailId;
          var pass = values.password;
          console.log('......1', email, pass);
          signInWithEmailPass(email, pass, formikActions.resetForm);
          // setDataToSQL(uname, pass);
        }, 1000);
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
        const {emailId, password} = values;
        return (
          <View>
            <ImageBackground
              source={BgLogin}
              resizeMode="stretch"
              style={{height: '100%', width: '100%'}}>
              <View style={styles.loginContainer}>
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
                {/* Login */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: '#47c153',
                    borderRadius: 20,
                    marginTop: 30,
                    width: '100%',
                    marginBottom: 8,
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
                {/* social login... */}
                <Text style={styles.textCommon}>Or, continue with..</Text>
                <View style={styles.socialContainer}>
                  {/* apple */}
                  <TouchableOpacity
                    style={styles.socialTouchable}
                    onPress={signInWithApple}>
                    <SvgComponent />
                    {/* <Image source={IcApple} style={styles.socialImage} /> */}
                    {/* <Svg height={30} width={30} viewBox="0 0 100 100">
                      <Circle
                        cx="50"
                        cy="50"
                        r="50"
                        stroke="purple"
                        strokeWidth=".1"
                        fill="red"
                      />
                    </Svg> */}
                  </TouchableOpacity>
                  {/* google */}
                  <TouchableOpacity
                    style={styles.socialTouchable}
                    onPress={signInWithGoogle}>
                    <Image source={IcGoogle} style={styles.socialImage} />
                  </TouchableOpacity>
                  {/* facebook */}
                  <TouchableOpacity
                    style={styles.socialTouchable}
                    onPress={signInWithFacebook}>
                    <Image source={IcFacebook} style={styles.socialImage} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    bottom: 0,
                  }}
                  onPress={() => {
                    navigation.navigate('SignUpScreen');
                  }}>
                  <Text style={styles.textCommon}>Don't have an account?</Text>
                  <Text style={{color: '#47c153', fontWeight: '800'}}>
                    {' '}
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        );
      }}
    </Formik>
    // </KeyboardAvoidingScrollView>
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
    alignItems: 'center',
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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '90%',
  },
  socialTouchable: {
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 8,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {height: 2, width: 2},
  },
  socialImage: {width: 30, height: 30},
});
