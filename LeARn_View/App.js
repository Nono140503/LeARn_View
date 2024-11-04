import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './app/screens/SplashScreen'; 
import OnboardingScreen from './app/screens/OnboardingScreen';
import LogIn from './app/screens/LogInScreen';
import ForgotPassword from './app/screens/ForgotPasswordScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import HomeScreen from './app/screens/StudentScreens/HomeScreen';
import Profile from './app/screens/StudentScreens/ProfileScreen';
import LeaderBoard from './app/screens/StudentScreens/LeaderBoardScreen';
import Settings from './app/screens/StudentScreens/Settings';
import Help from './app/screens/StudentScreens/Help';
import AR_EnvironmentMenuScreen from './app/screens/StudentScreens/AR_EnvironmentMenuScreen';
import LecturerDashboard from './app/screens/LecturerScreens/LecturerDashboard';
import ClassPerformance from './app/screens/LecturerScreens/ClassroomPerformanceScreen';
import GamesScreen from './app/screens/StudentScreens/GamesScreen';
import Computer_Components from './app/screens/StudentScreens/Computer_ComponentGame';
import QuizCreator from './app/screens/LecturerScreens/QuizCreator';
import TestCreator from './app/screens/LecturerScreens/TestCreator';
import GamesRules from './app/screens/StudentScreens/GameRules';
import StudentProgress from './app/screens/LecturerScreens/StudentsProgress';
import Progress from './app/screens/LecturerScreens/Progress';
import FeedBackScreen from './app/screens/LecturerScreens/FeedbackScreen';
import AddAnnouncementScreen from './app/screens/LecturerScreens/AddCommunication';
import LecturerSettingsScreen from './app/screens/LecturerScreens/Lecturer Settings';
import QuizList from './app/screens/StudentScreens/QuizList';
import QuizDetails from './app/screens/StudentScreens/QuizDetails';
import QuestionScreenFour from './app/screens/StudentScreens/QuestionScreenFour';
import QuestionScreenThree from './app/screens/StudentScreens/QuestionsScreenThree';
import QuestionScreenTwo from './app/screens/StudentScreens/QuestionTwoScreen';
import QuestionScreen from './app/screens/StudentScreens/QuestionsScreen';
import CorrectionsScreen from './app/screens/StudentScreens/CorrectionsScreen';
import CorrectionsScreenFour from './app/screens/StudentScreens/CorrectionScreenFour';
import CorrectionsScreenTwo from './app/screens/StudentScreens/CorrectionsScreenTwo';
import CorrectionsScreenThree from './app/screens/StudentScreens/CorrectionsScreenThree';
import CheckYourKnowledgeMenu from './app/screens/StudentScreens/CheckYourKnowledgeMenu';
import ScoreScreenFour from './app/screens/StudentScreens/ScoreScreenFour';
import ScoreScreenThree from './app/screens/StudentScreens/ScoreScreenThree';
import ScoreScreenTwo from './app/screens/StudentScreens/ScoreScreenTwo';
import ScoreScreen from './app/screens/StudentScreens/ScoreScreen';
import TestList from './app/screens/StudentScreens/TestList';
import TestDetail from './app/screens/StudentScreens/TestDetails';
import AnnouncementPage from './app/screens/StudentScreens/Announcements';
import GradesScreen from './app/screens/StudentScreens/GradesScreen';

const Stack = createStackNavigator();

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashFinish = () => {
    setShowSplashScreen(false); 
  };
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const resetQuiz = () => {
    setScore(0);
    setUserAnswers([]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {showSplashScreen ? (
          <Stack.Screen
            name="Splash" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <View style={styles.splashContainer}>
                <Splash {...props} onFinish={handleSplashFinish} />
              </View>
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Onboarding Screen" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login Screen" component={LogIn} options={{ headerShown: false }} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home Screen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile Screen" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="LeaderBoardScreen" component={LeaderBoard} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
            <Stack.Screen name="AR Environment Screen" component={AR_EnvironmentMenuScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Lecturer Dashboard" component={LecturerDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Class Performance" component={ClassPerformance} options={{ headerShown: false }} />
            <Stack.Screen name="Games Screen" component={GamesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Computer Components" component={Computer_Components} options={{ headerShown: false }} />
            <Stack.Screen name="Quiz Creator" component={QuizCreator} options={{ headerShown: false }} />
            <Stack.Screen name="Test Creator" component={TestCreator} options={{ headerShown: false }} />
            <Stack.Screen name="Game Rules" component={GamesRules} options={{ headerShown: false }} />
            <Stack.Screen name="Student Progress" component={StudentProgress} options={{ headerShown: false }} />
            <Stack.Screen name="Progress" component={Progress} options={{ headerShown: false }} />
            <Stack.Screen name="Feedback Screen" component={FeedBackScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add Announcement" component={AddAnnouncementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Lecturer Settings" component={LecturerSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Quiz Details" component={QuizDetails} options={{ headerShown: false }} />
            <Stack.Screen name="Quiz List" component={QuizList} options={{ headerShown: false }} />
            <Stack.Screen name="Test List" component={TestList} options={{headerShown: false}}/>
            <Stack.Screen name="Test Details" component={TestDetail} options={{headerShown: false}}/>
            <Stack.Screen name="Announcements" component={AnnouncementPage} options={{headerShown: false}}/>
            <Stack.Screen name="Forgot Password" component={ForgotPassword} options={{headerShown: false}}/>
            <Stack.Screen name="Grades Screen" component={GradesScreen} options={{headerShown: false}}/>
            
            <Stack.Screen name="Check Your Knowledge" component={CheckYourKnowledgeMenu} options={{headerShown: false}}/>
            <Stack.Screen name="Question" options={{headerShown: false}}>
              {props => (
                <QuestionScreen
                  {...props}
                  score={score}
                  setScore={setScore}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Score" options={{headerShown: false}}>
              {props => (
                <ScoreScreen
                  {...props}
                  score={score}
                  userAnswers={userAnswers}
                  resetQuiz={resetQuiz}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Corrections" component={CorrectionsScreen} options={{headerShown: false}}/>
          
            <Stack.Screen name="Question2"  options={{headerShown: false}}>
              {props => (
                <QuestionScreenTwo
                  {...props}
                  score={score}
                  setScore={setScore}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              )}

            </Stack.Screen>
            <Stack.Screen name="ScoreTwo"  options={{headerShown: false}}>
              {props => (
                <ScoreScreenTwo
                  {...props}
                  score={score}
                  userAnswers={userAnswers}
                  resetQuiz={resetQuiz}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="CorrectionsTwo" component={CorrectionsScreenTwo} options={{headerShown: false}}/>

            <Stack.Screen name="Question3" options={{headerShown: false}}>
              {props => (
                <QuestionScreenThree
                  {...props}
                  score={score}
                  setScore={setScore}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              )}

            </Stack.Screen>
            <Stack.Screen name="ScoreThree" options={{headerShown: false}}>
              {props => (
                <ScoreScreenThree
                  {...props}
                  score={score}
                  userAnswers={userAnswers}
                  resetQuiz={resetQuiz}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="CorrectionsThree" component={CorrectionsScreenThree} options={{headerShown: false}}/>
          

            <Stack.Screen name="Question4" options={{headerShown: false}}>
              {props => (
                <QuestionScreenFour
                  {...props}
                  score={score}
                  setScore={setScore}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="ScoreFour" options={{headerShown: false}}>
              {props => (
                <ScoreScreenFour
                  {...props}
                  score={score}
                  userAnswers={userAnswers}
                  resetQuiz={resetQuiz}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CorrectionsFour" component={CorrectionsScreenFour} options={{headerShown: false}}/>
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
