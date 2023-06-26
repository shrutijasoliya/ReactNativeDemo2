import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Share,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';
import {EventRegister} from 'react-native-event-listeners';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

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
  const [userDetailList, setUserDetailList] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [ampm, setAmpm] = useState('');

  // const {username, password} = route.params.userDetails;

  useEffect(() => {
    const myCustomEventHandler = string => {
      console.log('+-+-+-+-+ ... home screen 123 ', string);
    };
    EventRegister.addEventListener(
      'myCustomEvent',
      myCustomEventHandler('started'),
    );
    getDataFromSQL();
    EventRegister.emit('myCustomEvent');

    return () => {
      EventRegister.removeEventListener(
        'myCustomEvent',
        myCustomEventHandler('removed'),
      );
    };
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

  const shareLinkHandler = async link => {
    try {
      const result = await Share.share({
        message: link,
        title: 'this is a title',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('activity type...', result.activityType);
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('action dismissed..');
      }
    } catch (error) {
      console.log('error in share a link...', error);
    }
  };

  //foreground
  const handleDynamicLink = link => {
    console.log('foreground', link);
    // Handle dynamic link inside your own application
    if (link?.url === 'https://www.youtube.com/') {
      // ...navigate to your offers screen
      navigation.navigate('DeepLink');
    } else {
      console.log('link does not match');
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
          console.log('link does not match');
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
      {/* Deep link */}
      <View style={{alignItems: 'center'}}>
        <Text style={styles.text}>{generatedLink}</Text>
        {generatedLink && (
          <View style={{flexDirection: 'row', columnGap: 10}}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                Clipboard.setString(generatedLink);
                ToastAndroid.show('Copied', ToastAndroid.SHORT);
              }}>
              <Text style={styles.text}>Copy link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                shareLinkHandler(generatedLink);
              }}>
              <Text style={styles.text}>Share link</Text>
            </TouchableOpacity>
          </View>
        )}
        <Button title="generate deep link" onPress={buildLink} />
      </View>
      {/* DateTimePicker */}
      <View style={{flexDirection: 'row', columnGap: 50}}>
        {/* DatePicker */}
        <View style={{alignItems: 'center'}}>
          <Text style={styles.text}>
            Date : {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
          </Text>
          {showPicker && (
            <RNDateTimePicker
              value={new Date()}
              mode="date"
              display="calendar"
              dateFormat="dayofweek day month"
              onChange={date => {
                let newTimeStamp = date.nativeEvent.timestamp;
                console.log('selected timestamp : ', newTimeStamp);
                let newDate = new Date(newTimeStamp);
                console.log('selected date : ', newDate);
                setShowPicker(false);
                setDate(newDate);
              }}
            />
          )}
          <Button
            title="date picker"
            onPress={() => {
              console.log('current date : ', date);
              setShowPicker(true);
            }}
          />
        </View>
        {/* TimePicker */}
        <View style={{alignItems: 'center'}}>
          <Text style={styles.text}>
            Time :{' '}
            {date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:
            {date.getMinutes()}:{date.getSeconds()}
            {date.getHours() > 12 ? ' PM' : ' AM'}
          </Text>
          {showTimePicker && (
            <RNDateTimePicker
              value={new Date()}
              mode="time"
              display="clock"
              onChange={time => {
                let newTimeStamp = time.nativeEvent.timestamp;
                console.log('selected time : ', newTimeStamp);
                let newTime = new Date(newTimeStamp);
                console.log('selected date : ', newTime);
                setShowTimePicker(false);
                setDate(newTime);
              }}
            />
          )}
          <Button
            title="time picker"
            onPress={() => {
              console.log('current time : ', date);
              setShowTimePicker(true);
            }}
          />
        </View>
      </View>
      <Button title="get notification" onPress={pushNotificationHandler} />
      <Button
        title="Google Map"
        onPress={() => navigation.navigate('MapViewScreen')}
      />
      <Button
        title="Web View"
        onPress={() => {
          navigation.navigate('WebViewScreen');
        }}
      />
      <Button
        title="File system"
        onPress={() => {
          navigation.navigate('FileScreen');
        }}
      />
      <Button
        title="Payment Screen"
        onPress={() => {
          navigation.navigate('PaymentScreen');
        }}
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
  linkButton: {
    borderColor: 'grey',
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    marginTop: 5,
    marginBottom: 10,
  },
});
