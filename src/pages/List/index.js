import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  useColorScheme,
  View,
} from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {USER_NOTES} from '../../constants/constants';
import {Button} from 'react-native-paper';

export default function List({navigation, route}) {
  const [noteList, setNoteList] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function init() {
    try {
      console.log('entra no init');
      const jsonValue = await AsyncStorage.getItem(USER_NOTES);
      listJson = jsonValue != null ? JSON.parse(jsonValue) : {};
      console.log(listJson);
      if (listJson) {
        setNoteList(listJson);
      }
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  const deleteNote = async (id) => {
    try {
      let itens = noteList.filter(function(i) { return i.id !== id; });
      const jsonValue = JSON.stringify(itens)
      await AsyncStorage.setItem(USER_NOTES, jsonValue);
    } catch (error) {
      console.log(error.message);
    } finally {
      init()
    }
  }

  const editNote = async (id) => {
    try {
      let item = noteList.find(item => item.id == id)
      navigation.navigate('New Notes', {item});
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.bodyContainer}>
        <View>
          <View style={{alignItems: 'center', padding: 10}}>
            <Text style={styles.title}>Note List</Text>
          </View>
        </View>
        <View style={styles.list}>
          <FlatList
            ListEmptyComponent={<Text>Nao ha notas na lista</Text>}
            data={noteList}
            renderItem={({item}) => (
              <View style={styles.item}>
                <View>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.client}>{item.client}</Text>
                  <Text style={styles.note}>{item.note}</Text>
                </View>
                <View>
                  <Button
                    icon='note-edit'
                    buttonColor='#14375d'
                    mode="text"
                    onPress={() => {editNote(item.id)}}>
                  </Button>
                  <Button
                    icon='delete-forever'
                    buttonColor='#14375d'
                    mode="text"
                    onPress={() => {deleteNote(item.id)}}>
                  </Button>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}></FlatList>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonColor={'#14375d'}
            mode="contained"
            onPress={() => navigation.navigate('New Notes')}>Create new note</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
