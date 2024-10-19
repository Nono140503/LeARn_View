import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { db } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';

const QuizDetail = ({ route, navigation }) => {
  const { quiz, attempts } = route.params;
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const studentId = auth.currentUser.uid;

  useEffect(() => {
    // Check if the quiz is still available based on due date
    const currentDate = new Date();
    const dueDate = new Date(quiz.dueDate); // Assuming dueDate is in ISO string format
    if (currentDate > dueDate) {
      Alert.alert('Quiz Expired', 'This quiz is no longer available.');
      navigation.goBack(); // Navigate back or take any action you prefer
    }
  }, []);

  // Handle option selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  // Submit answers and calculate score
  const submitAnswers = async () => {
    setLoading(true);
    let calculatedScore = 0;

    quiz.questions.forEach((q, index) => {
      const selectedAnswerIndex = answers[index];
      const correctAnswerIndex = parseInt(q.correctAnswer);
      if (selectedAnswerIndex === correctAnswerIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
    Alert.alert(
      'Quiz Completed',
      `You scored ${calculatedScore} out of ${quiz.questions.length}`,
      [{ text: 'OK' }]
    );

    // Save attempt to Firestore
    const quizAttemptsRef = doc(db, 'quizAttempts', `${quiz.id}_${studentId}`);
    const docSnapshot = await getDoc(quizAttemptsRef);

    if (docSnapshot.exists()) {
      const attemptsData = docSnapshot.data();
      const updatedAttempts = [...attemptsData.attempts, calculatedScore];
      await updateDoc(quizAttemptsRef, { attempts: updatedAttempts });
    } else {
      await setDoc(quizAttemptsRef, { quizId: quiz.id, studentId, attempts: [calculatedScore] });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{quiz.title}</Text>
        <Text style={styles.details}>Duration: {quiz.duration} minutes</Text>
        <Text style={styles.details}>Due Date: {new Date(quiz.dueDate).toLocaleDateString()}</Text>

        {quiz.questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.question}>{`Q${index + 1}: ${q.question}`}</Text>
            {q.options.map((option, oIndex) => {
              let optionStyle = styles.optionButton;

              if (submitted) {
                const correctAnswerIndex = parseInt(q.correctAnswer);
                const selectedAnswerIndex = answers[index];

                if (selectedAnswerIndex === correctAnswerIndex) {
                  optionStyle = styles.correctOption; // Green for correct
                } else {
                  if (oIndex === correctAnswerIndex) {
                    optionStyle = styles.correctOption; // Correct option highlighted
                  }
                  if (oIndex === selectedAnswerIndex) {
                    optionStyle = styles.wrongOption; // Wrong option in red
                  }
                }
              }

              return (
                <TouchableOpacity
                  key={oIndex}
                  style={[
                    optionStyle,
                    !submitted && answers[index] === oIndex ? styles.selectedOption : null
                  ]}
                  onPress={() => !submitted && handleAnswerSelect(index, oIndex)}
                >
                  <Text>{`${String.fromCharCode(65 + oIndex)}: ${option}`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Submit Answers" onPress={submitAnswers} disabled={loading || submitted} />
      </View>

      {score !== null && (
        <Text style={styles.scoreText}>You scored: {score} / {quiz.questions.length}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555', // Optional: Style for the details
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#d3f8d3',
  },
  correctOption: {
    backgroundColor: '#d4edda',
  },
  wrongOption: {
    backgroundColor: '#f8d7da',
  },
  scoreText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default QuizDetail;
