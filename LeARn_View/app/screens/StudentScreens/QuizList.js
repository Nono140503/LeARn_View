import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../../firebase';

const QuizList = ({ navigation }) => {
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
      <View style={styles.quizContainer}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.infoText}>Attempts left: {attemptsLeft}</Text>
        <Text style={styles.infoText}>Duration: {item.duration} minutes</Text>
        <Text style={styles.infoText}>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <Button
          title={attemptsLeft > 0 ? "Take Quiz" : "No Attempts Left"}
          onPress={() => handleQuizPress(item)}
          disabled={attemptsLeft === 0}
          color={attemptsLeft > 0 ? '#227d39' : '#ccc'} // Change button color based on attempts
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Quizzes</Text>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    paddingTop:30,
    textAlign: 'center',
    marginBottom: 20,
    color: '#227d39', 
  },
  quizContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9', 
    borderRadius: 8,
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
});

export default QuizList;
