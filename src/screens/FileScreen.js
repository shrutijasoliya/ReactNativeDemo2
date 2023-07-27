import {StyleSheet, Text, View, Button, Image, Dimensions} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
// import FileViewer from 'react-native-file-viewer';
import Pdf from 'react-native-pdf';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import {stat} from 'react-native-fs';
('rn-fetch-blob');

export default function FileScreen() {
  let date = new Date();
  const storageReference = storage().ref('PDF/demo.pdf');
  const [fileResponse, setFileResponse] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [downLoadUrl, setDownLoadUrl] = useState('');

  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      setFileResponse(response);
      console.log('file response........ ', response);
      //   await FileViewer.open(response.uri);
      //   UriToPath(response.uri);
      uploadFileToFirebase(response.fileCopyUri);
    } catch (error) {
      console.log('error in file response..... ', error);
    }
  };

  const uploadFileToFirebase = async filePathUri => {
    console.log('content uri.. ', filePathUri);
    const uploaded = await storageReference.putFile(filePathUri);
    console.log('file uploaded to firebase... ', uploaded);
    setIsFileUploaded(true);
  };

  const fileDownloadHandler = async () => {
    const downLoadUrl = await storage().ref('PDF/demo.pdf').getDownloadURL();
    console.log('download url.. ', downLoadUrl);
    setDownLoadUrl(downLoadUrl);

    let RootDir = RNFetchBlob.fs.dirs.DownloadDir;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/demo_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.pdf',
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    })
      .fetch('GET', downLoadUrl)
      .then(res => {
        console.log('file downloaded successfully... ', res);
      });
  };

  const UriToPath = async contentUri => {
    console.log('content uri.. ', contentUri);
    await RNFetchBlob.fs
      .stat(contentUri)
      .then(stat => {
        console.log('uri to path ... ', stat);
      })
      .catch(error => {
        console.log('uri to path error ... ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick File" onPress={filePickerHandler} />
      {fileResponse && (
        <View style={styles.fileResponseContainer}>
          <Text
            style={[
              styles.text,
              {fontSize: 16, fontWeight: '800', marginBottom: 5},
            ]}>
            File Response
          </Text>
          <View>
            <Text style={styles.text}>File Name: {fileResponse.name}</Text>
            <Text style={styles.text}>File Uri: {fileResponse.uri}</Text>
          </View>
          <Pdf
            source={{uri: fileResponse.uri}}
            style={styles.pdf}
            scale={1}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}></Pdf>
          {downLoadUrl && (
            <Text style={styles.text}>Download Url: {downLoadUrl}</Text>
          )}
          {/* <Image
            style={styles.fileResponseImg}
            source={{uri: fileResponse.uri}}></Image> */}
        </View>
      )}
      {isFileUploaded && (
        <Button title="Download File" onPress={fileDownloadHandler} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 30,
  },
  text: {
    color: 'black',
  },
  fileResponseContainer: {
    flex: 1,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 20,
  },
  fileResponseImg: {width: 200, height: 200, marginTop: 10},
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 70,
    height: Dimensions.get('window').height - 100,
    marginTop: 10,
  },
});
