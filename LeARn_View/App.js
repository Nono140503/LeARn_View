import  React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './app/screens/SplashScreen';
import SignIn from './app/screens/SignIn';
import SignUpScreen from './app/screens/SignUpScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name='Sign Up' component={SignUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;