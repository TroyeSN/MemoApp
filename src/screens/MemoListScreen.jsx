import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Alert,
} from 'react-native';
import firebase from 'firebase';

import MemoList from '../components/MemoList';
import CircleButton from '../components/CircleButton';
import Button from '../components/Button';
import Loading from '../components/Loading';
import HeaderRightButton from '../components/HeaderRightButton';
import TrackingTransparency from '../components/TrackingTransparency';

export default function MemoListScreen(props) {
  const { navigation } = props;
  const [memos, setMemos] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const cleanupFuncs = {
      auth: () => { },
      memos: () => { },
    };

    cleanupFuncs.auth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.firestore();
        const ref = db.collection(`users/${user.uid}/memos`).orderBy('updatedAt', 'desc');
        cleanupFuncs.memos = ref.onSnapshot((snapshot) => {
          const userMemos = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userMemos.push({
              id: doc.id,
              bodyText: data.bodyText,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          setMemos(userMemos);
          setLoading(false);
        }, () => {
          setLoading(false);
        });
        navigation.setOptions({
          headerRight: () => (
            <HeaderRightButton currentUser={user} cleanupFuncs={cleanupFuncs} />
          ),
        });
      } else {
        firebase.auth().signInAnonymously()
          .catch(() => {
            Alert.alert('エラー', 'アプリを再起動して下さい');
          })
          .then(() => { setLoading(false); });
      }
    });
    return () => {
      cleanupFuncs.auth();
      cleanupFuncs.memos();
    };
  }, []);

  if (memos.length === 0) {
    return (
      <View style={emptyStyles.container}>
        <Loading isLoading={isLoading} />
        <TrackingTransparency />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう!</Text>
          <Button
            style={emptyStyles.button}
            label="作成する"
            onPress={() => { navigation.navigate('MemoCreate'); }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MemoList memos={memos} />
      <CircleButton
        name="plus"
        onPress={() => { navigation.navigate('MemoCreate'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});
