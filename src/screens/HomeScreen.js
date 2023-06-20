import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';

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

const HomeScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDetailList, setUserDetailList] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');

  // const {username, password} = route.params.userDetails;

  useEffect(() => {
    getDataFromSQL();
  }, []);

  const getDataFromSQL = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Username, Password FROM UserDetails',
        [],
        (tx, results) => {
          console.log('......3', results.rows);
          var length = results.rows.length;

          for (let index = 0; index < length; index++) {
            const element = results.rows.item(index);
            console.log('.....4', element);
            setUserDetailList(prev => [...prev, element]);
          }

          console.log('.....5', userDetailList);
          // if (length > 0) {
          //   setUsername(results.rows.item(0).Username);
          //   setPassword(results.rows.item(0).Password);
          // }
        },
      );
    });
  };

  const pushNotificationHandler = () => {
    PushNotification.localNotification({
      channelId: 'channel-id-test',
      id: 0,
      title: 'My notification title',
      message: 'My notification message',
      playSound: true,
      soundName: 'default',
      // color:'red',
      // actions: ["ReplyInput"],
      // actions: ["Yes", "No"],
      // repeatType: 'minute',
      // repeatTime: 3,
    });

    PushNotification.localNotificationSchedule({
      channelId: 'channel-id-test',
      title: 'My scheduled notification title',
      message: 'My scheduled Notification Message after 15 seconds',
      date: new Date(Date.now() + 15 * 1000),
      allowWhileIdle: false,
    });
  };

  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://www.youtube.com/',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://reactnativedeeplinking.page.link/2irR',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    setGeneratedLink(link);
  };

  //foreground
  const handleDynamicLink = link => {
    console.log('foreground', link);
    // Handle dynamic link inside your own application
    if (link?.url === 'https://www.youtube.com/') {
      // ...navigate to your offers screen
      navigation.navigate('DeepLink');
    } else {
      Alert.alert('link does not match');
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  //background
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log('background', link);

        if (link?.url === 'https://www.youtube.com/') {
          // ...navigate to your offers screen

          navigation.navigate('DeepLink');
        } else {
          Alert.alert('link does not match');
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={{borderWidth: 1, borderColor: 'black'}}>
        <FlatList
          data={userDetailList}
          renderItem={({item, index}) => {
            return (
              <View
                style={[
                  styles.flatItem,
                  {backgroundColor: index % 2 == 0 ? '#80808008' : 'white'},
                ]}>
                <Text style={styles.text}>{item.Username}</Text>
                <Text style={styles.text}>{item.Password}</Text>
              </View>
            );
          }}
        />
      </View> */}
      <View style={{alignItems: 'center'}}>
        <Text style={styles.text}>{generatedLink}</Text>
        {generatedLink && (
          <TouchableOpacity
            style={{
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 1,
              padding: 5,
              marginTop: 5,
            }}
            onPress={() => {
              Clipboard.setString(generatedLink);
            }}>
            <Text style={styles.text}>Copy link</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button title="generate deep link" onPress={buildLink} />
      <Button title="get notification" onPress={pushNotificationHandler} />
      <Button
        title="Google Map"
        onPress={() => navigation.navigate('MapViewScreen')}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'black',
  },
  flatItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
});
