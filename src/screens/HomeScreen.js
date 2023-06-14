import {Button, StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';

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

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDetailList, setUserDetailList] = useState([]);

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
      <Button title="get notification" onPress={pushNotificationHandler} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
