import React, {useState, useEffect} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {
  SafeAreaView,
  Text,
  TextInput,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {USER_NOTES} from '../../constants/constants';

export default function Notes({navigation, route}) {
  const [note, setNote] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [idEdit, setIdEdit] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const clients = ['Client A', 'Client B', 'Client C'];
  const categories = ['Goal Evidence', 'Support Coordination', 'Active Duty'];

  let notes = {
    id: Math.floor(Date.now() * Math.random()).toString(36),
    client: client,
    category: category,
    note: note,
  };

  async function init() {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_NOTES);
      listJson = jsonValue != null ? JSON.parse(jsonValue) : {};
      setNoteList(listJson);
      if (route.params) {
        setIdEdit(route.params.item.id);
        setNote(route.params.item.note);
        setCategory(route.params.item.category);
        setClient(route.params.item.client);
      }
    } catch (e) {
      // error reading value
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const changeNote = text => {
    setNote(text);
    notes.note = text;
  };

  const CreateNewNote = async () => {
    try {
      let list = noteList;
      list.push(notes);
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem(USER_NOTES, jsonValue);
    } catch (e) {
      // saving error
    } finally {
      navigation.navigate('Notes');
    }
  };

  const EditNote = async () => {
    try {
      let list = noteList;
      list.push(notes);
      let itens = list.filter(function(i) { return i.id !== idEdit; });
      const jsonValue = JSON.stringify(itens);
      await AsyncStorage.setItem(USER_NOTES, jsonValue);
    } catch (e) {
      // saving error
    } finally {
      navigation.navigate('Notes');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {isLoading && <Text>Loading</Text>}
      {!isLoading && (
        <View style={styles.bodyContainer}>
          <View>
            <View style={{alignItems: 'center', padding: 10}}>
              <Text style={styles.title}>Care Master Test</Text>
            </View>
            <View style={styles.selectContainer}>
              <SelectDropdown
                data={categories}
                buttonStyle={styles.select}
                buttonTextStyle={{fontSize: 14}}
                onSelect={(selectedItem, index) => {
                  setCategory(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                defaultValue={category}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
              <SelectDropdown
                data={clients}
                buttonStyle={styles.select}
                buttonTextStyle={{fontSize: 14}}
                onSelect={(selectedItem, index) => {
                  setClient(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                defaultValue={client}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
            <View style={styles.noteContainer}>
              <Text>Insert your notes here</Text>
              <TextInput
                style={styles.input}
                multiline={true}
                value={note}
                numberOfLines={14}
                onChangeText={text => changeNote(text)}></TextInput>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {!idEdit &&(
              <Button
                color={'#14375d'}
                onPress={CreateNewNote}
                title="Save new note"></Button>
            )}
            {idEdit &&(
              <Button
              color={'#14375d'}
              onPress={EditNote}
              title="Save edit"></Button>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
