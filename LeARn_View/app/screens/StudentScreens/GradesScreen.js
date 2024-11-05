import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BottomTabBar from '../../../components/BottomTabBar';
import themeContext from '../../../components/ThemeContext';

const GradesScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Grades Screen');
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [year, setYear] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useContext(themeContext);
  const user = auth.currentUser ;

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    navigation.navigate(screen);
  };

  // Fetch User data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username);
        setEmail(userData.email);
      } else {
        Alert.alert('User  Not Found', 'Student profile does not exist.');
      }

      const userPFP = doc(db, 'users', user.uid);
      const userPFP_Doc = await getDoc(userPFP);

      if (userPFP_Doc.exists()) {
        const userPFP_Data = userPFP_Doc.data();
        setImage(userPFP_Data.profileImage);
      }
    };

    const fetchQuizScores = async () => {
      try {
        const quizScoresRef = doc(db, 'quizScores', user.uid); 
        const quizScoresDoc = await getDoc(quizScoresRef);

        if (quizScoresDoc.exists()) {
          const scoresData = quizScoresDoc.data();
          const quizList = Object.keys(scoresData).map((quizId) => ({
            id: quizId,
            score: scoresData[quizId].score, 
            totalQuestions: scoresData[quizId].totalQuestions, 
            date: scoresData[quizId].submittedAt || 'Date Not Available', 
            title: scoresData[quizId].title || 'Untitled Quiz', 
          }));
          setQuizzes(quizList);
        } else {
          Alert.alert('No Scores Found', 'You have not completed any quizzes yet.');
        }
      } catch (error) {
        console.error("Error fetching quiz scores: ", error);
        Alert.alert('Error', 'There was an error fetching your quiz scores. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
    fetchQuizScores();
  }, [user.uid]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Grades</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Image source={image ? { uri: image } : null} style={styles.avatar} />
          <View>
            <Text style={styles.userDetail}>Name: {username}</Text>
            <Text style={styles.userDetail}>Email: {email}</Text>
            <Text style={styles.userDetail}>Year: 1st year</Text>
            <Text style={styles.userDetail}>Course: BIT</Text>
          </View>
        </View>

        {/* Quiz Grades */}
        <View style={styles.quizzes}>
      {quizzes.map((quiz) => {
        const percentage = (quiz.score / quiz.totalQuestions) * 100;

        // Determine background color based on percentage
        let backgroundColor;
        if (percentage >= 90) {
          backgroundColor = '#007A33'; 
        } else if (percentage >= 80) {
          backgroundColor = '#00cc00'; 
        } else if (percentage >= 70) {
          backgroundColor = '#99cc00'; 
        } else if (percentage >= 60) {
          backgroundColor = '#ffcc00'; 
        } else if (percentage >= 50) {
          backgroundColor = '#ff9933'; 
        } else if (percentage >= 40) {
          backgroundColor = '#ff6600'; 
        } else if (percentage >= 30) {
          backgroundColor = '#ff3333'; 
        } else {
          backgroundColor = '#cc0000'; 
        }

        return (
          <View key={quiz.id} style={styles.quizCard}>
            <Text style={styles.quizTitle}>{quiz.title} Quiz</Text>
            <Text style={styles.quizDate}>{quiz.date}</Text>
            <Text style={[styles.quizMark, { backgroundColor }]}>
              Score: {quiz.score}/{quiz.totalQuestions} ({percentage.toFixed(2)}%)
            </Text>
          </View>
        );
      })}
    </View>
      </ScrollView>
      <BottomTabBar
        navigation={navigation}
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
    paddingTop: 20,
    color: '#227d39',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#4CAF50',
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    marginTop: 10,
  },
  userDetail: {
    fontSize: 16,
    color: 'white',
  },
  quizzes: {
    margin: 16,
  },
  quizCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quizDate: {
    fontSize: 14,
    marginBottom: 8,
    color: 'gray',
  },
  quizMark: {
    fontSize: 16,
    color: 'white',
    padding: 8,
    borderRadius: 4,
  },

});

export default GradesScreen;