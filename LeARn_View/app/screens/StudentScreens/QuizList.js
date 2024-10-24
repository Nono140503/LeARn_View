import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../../firebase';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attemptsData, setAttemptsData] = useState({});
  const studentId = auth.currentUser.uid;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesCollection = collection(db, 'quizzes');
        const quizSnapshot = await getDocs(quizzesCollection);
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizList);

        const attemptsQuery = query(collection(db, 'quizAttempts'), where('studentId', '==', studentId));
        const attemptsSnapshot = await getDocs(attemptsQuery);
        const attempts = {};
        attemptsSnapshot.docs.forEach(doc => {
          attempts[doc.data().quizId] = doc.data().attempts;
        });
        setAttemptsData(attempts);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        Alert.alert('Error', 'Could not retrieve quizzes. Please try again later.');
      }
    };

    fetchQuizzes();
  }, []);

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
        navigation.navigate('Quiz Details', { quiz, attempts });
      }
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
            <Text style={[styles.textShadow,styles.testTitle]}>{item.title}</Text>
            <Text style={[styles.textShadow,styles.infoText]}>Duration: {item.duration} minutes</Text>
            <Text style={[styles.textShadow,styles.infoText]}>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
            <Text style={[styles.textShadow,styles.attemptsText, attemptsLeft === 0 && styles.attemptsExhausted]}>
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
    <View style={styles.container}>
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
