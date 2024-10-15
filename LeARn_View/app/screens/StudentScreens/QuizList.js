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
      navigation.navigate('Quiz Details', { quiz, attempts });
    }
  };

  const renderItem = ({ item }) => {
    const attempts = attemptsData[item.id] || [];
    const attemptsLeft = 3 - attempts.length;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text>Attempts left: {attemptsLeft}</Text>
        <Button
          title={attemptsLeft > 0 ? "Take Quiz" : "No Attempts Left"}
          onPress={() => handleQuizPress(item)}
          disabled={attemptsLeft === 0}
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
    padding: 50,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  quizContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quizTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default QuizList;
