import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './app/screens/SplashScreen'; 
import OnboardingScreen from './app/screens/OnboardingScreen';
import LogIn from './app/screens/LogInScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import HomeScreen from './app/screens/HomeScreen';
import Profile from './app/screens/ProfileScreen';
import LeaderBoard from './app/screens/LeaderBoardScreen';

const Stack = createStackNavigator();

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashFinish = () => {
    setShowSplashScreen(false); 
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName= 'Splash'
        
      >
        {showSplashScreen ? (
          <Stack.Screen
            name="Splash" options={{headerShown: false}}
          >
            {(props) => (
              <View style={styles.splashContainer}>
                <Splash {...props} onFinish={handleSplashFinish} />
              </View>
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding Screen"
              component={OnboardingScreen}
              options={{headerShown: false}}/>
            <Stack.Screen name="Login Screen" component={LogIn} options={{headerShown: false}}/>
            <Stack.Screen name="Sign Up" component={SignUpScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home Screen" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ProfileScreen" component={Profile} options={{ headerShown: false}}/>
            <Stack.Screen name="LeaderBoardScreen" component={LeaderBoard} options={{headerShown: false}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#4CAF50', 
  },
});

export default App;
