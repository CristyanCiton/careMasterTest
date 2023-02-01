import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notes from './pages/Notes';
import List from './pages/List';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Notes" component={List} />
        <Stack.Screen name="New Notes" component={Notes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;