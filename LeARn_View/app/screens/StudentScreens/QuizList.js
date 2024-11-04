import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import { db } from '../../../firebase';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';
import themeContext from '../../../components/ThemeContext';

const QuizList = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [attemptsData, setAttemptsData] = useState({});
  const theme = useContext(themeContext);
  const studentId = auth.currentUser .uid;

  useEffect(() => {
    // Real-time listener for quizzes
    const quizzesCollection = collection(db, 'quizzes');
    const unsubscribeQuizzes = onSnapshot(quizzesCollection, (snapshot) => {
      const quizList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    }, (error) => {
      console.error("Error fetching quizzes:", error);
      Alert.alert('Error', 'Could not retrieve quizzes. Please try again later.');
    });

    // Real-time listener for quiz attempts
    const attemptsQuery = query(collection(db, 'quizAttempts'), where('studentId', '==', studentId));
    const unsubscribeAttempts = onSnapshot(attemptsQuery, (snapshot) => {
      const attempts = {};
      snapshot.docs.forEach(doc => {
        attempts[doc.data().quizId] = doc.data().attempts || [];
      });
      setAttemptsData(attempts);
    }, (error) => {
      console.error("Error fetching attempts:", error);
      Alert.alert('Error', 'Could not retrieve attempts. Please try again later.');
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeQuizzes();
      unsubscribeAttempts();
    };
  }, [studentId]);

  const handleQuizPress = (quiz) => {
    const attempts = attemptsData[quiz.id] || [];
    if (attempts.length >= 3) {
      Alert.alert('Attempts exhausted', 'You have used all your attempts for this quiz.');
    } else {
      // Check if the quiz is expired
      const currentDate = new Date();
      const dueDate = new Date(quiz.dueDate); // Assuming dueDate is in ISO string format
      if (currentDate > dueDate) {
        Alert.alert('Quiz Expired', 'This quiz is no longer available.');
      } else {
        // Record the attempt in Firestore
        recordAttempt(quiz.id);
        navigation.navigate('Quiz Details', { quiz, attempts });
      }
    }
  };

  const recordAttempt = async (quizId) => {
    const quizAttemptsRef = doc(db, 'quizAttempts', `${quizId}_${studentId}`);
    const docSnapshot = await getDoc(quizAttemptsRef);

    try {
      if (docSnapshot.exists()) {
        const attemptsData = docSnapshot.data();
        await updateDoc(quizAttemptsRef, { attempts: [...attemptsData.attempts, new Date()] });
      } else {
        await setDoc(quizAttemptsRef, { quizId, studentId, attempts: [new Date()] });
      }
    } catch (error) {
      console.error("Error recording attempt:", error);
      Alert.alert('Error', 'Could not record your attempt. Please try again later.');
    }
  };

  const renderItem = ({ item }) => {
    const attempts = attemptsData[item.id] || [];
    const attemptsLeft = 3 - attempts.length;

    return (
      <View style={styles.testContainer}>
        <ImageBackground
          source={item.image}
          style={styles.imageBackground}
          imageStyle={styles.imageBorderRadius}
        >
          <View style={styles.overlay} />
          <View style={styles.testContent}>
            <Text style={[styles.textShadow, styles.testTitle]}>{item.title}</Text>
            <Text style={[styles.textShadow, styles.infoText]}>Duration: {item.duration} minutes</Text>
            <Text style={[styles.textShadow, styles.infoText]}>Due Date: {item.dueDate.toLocaleString()}</Text>
            <Text style={[styles.textShadow, styles.attemptsText, attemptsLeft === 0 && styles.attemptsExhausted]}>
              Attempts left: {attemptsLeft}
            </Text>
          </View>
        </ImageBackground>
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: attemptsLeft > 0 ? '#4CAF50' : '#999' }]}
          onPress={() => handleQuizPress(item)}
          disabled={attemptsLeft === 0}
        >
          <Text style={styles.testButtonText}>
            {attemptsLeft > 0 ? 'Take Quiz' : 'No Attempts Left'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={styles.header}>Available Quizzes</Text>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  testContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageBackground: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  imageBorderRadius: {
    borderRadius: 10,
  },

  testContent: {
    padding: 15,
  },

  textShadow: {
    textShadowColor: 'black', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2, 
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
  },
  attemptsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  attemptsExhausted: {
    color: '#FF5252',
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizList;
