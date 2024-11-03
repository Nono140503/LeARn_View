import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const QuizDetail = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const studentId = auth.currentUser .uid;

  useEffect(() => {
    const currentDate = new Date();
    const dueDate = new Date(quiz.dueDate.seconds * 1000); // Convert Firestore timestamp to Date
    const unlockDate = new Date(quiz.unlockDate.seconds * 1000); // Convert Firestore timestamp to Date

    if (currentDate < unlockDate) {
      Alert.alert('Quiz Locked', 'This quiz is not available yet.');
      navigation.goBack();
    } else if (currentDate > dueDate) {
      Alert.alert('Quiz Expired', 'This quiz is no longer available.');
      navigation.goBack();
    }
  }, [quiz, navigation]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const saveHighestScore = async (calculatedScore) => {
    const quizScoresRef = doc(db, 'quizScores', studentId);
    const docSnapshot = await getDoc(quizScoresRef);
  
    const submissionDate = new Date().toISOString(); // Get current date and time in ISO format
  
    try {
      if (docSnapshot.exists()) {
        const scoresData = docSnapshot.data();
        const currentScore = scoresData[quiz.id]?.score || 0;
  
        if (calculatedScore > currentScore) {
          await updateDoc(quizScoresRef, {
            [quiz.id]: {
              score: calculatedScore,
              totalQuestions: quiz.questions.length, // Save total number of questions
              title: quiz.title,
              submittedAt: submissionDate,
            },
          });
          Alert.alert('Score Updated', `Your new highest score is ${calculatedScore}. Total questions: ${quiz.questions.length}`);
        } else {
          Alert.alert('Score Not Updated', `Your score of ${calculatedScore} is not higher than your previous score of ${currentScore}. Total questions: ${quiz.questions.length}`);
        }
      } else {
        await setDoc(quizScoresRef, {
          [quiz.id]: {
            score: calculatedScore,
            totalQuestions: quiz.questions.length, // Save total number of questions
            title: quiz.title,
            submittedAt: submissionDate,
          },
        });
        Alert.alert('Score Saved', `Your score of ${calculatedScore} has been saved. Total questions: ${quiz.questions.length}`);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error saving your score. Please try again later.');
      console.error("Error saving score: ", error);
    }
  };

  const submitAnswers = async () => {
    setLoading(true);
    let calculatedScore = 0;

    // Calculate score based on selected answers
    quiz.questions.forEach((q, index) => {
      if (answers[index] === parseInt(q.correctAnswer.charCodeAt(0) - 65)) { // Convert 'A' to 0, 'B' to 1, etc.
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

    // Record attempt
    const quizAttemptsRef = doc(db, 'quizAttempts', `${quiz.id}_${studentId}`);
    const docSnapshot = await getDoc(quizAttemptsRef);

    try {
      if (docSnapshot.exists()) {
        const attemptsData = docSnapshot.data();
        await updateDoc(quizAttemptsRef, { attempts: [...attemptsData.attempts, calculatedScore] });
      } else {
        await setDoc(quizAttemptsRef, { quizId: quiz.id, studentId, attempts: [calculatedScore] });
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error recording your attempt. Please try again later.');
      console.error("Error recording attempt: ", error);
    }

    await saveHighestScore(calculatedScore);
    navigation.navigate('Quiz List'); // Replace 'QuizList' with the actual name of your quiz list screen
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{quiz.title}</Text>
        <Text style={styles.details}>Duration: {quiz.duration}</Text>
        <Text style={styles.details}>Due Date: {new Date(quiz.dueDate.seconds * 1000).toLocaleDateString()} {quiz.dueTime.hours}:{quiz.dueTime.minutes}</Text>
        <Text style={styles.details}>Unlock Date: {new Date(quiz.unlockDate.seconds * 1000).toLocaleDateString()} {quiz.unlockTime.hours}:{quiz.unlockTime.minutes}</Text>

        {quiz.questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.question}>{`Q${index + 1}: ${q.question}`}</Text>
            {q.options.map((option, oIndex) => {
              let optionStyle = styles.optionButton;
              if (submitted) {
                const correctAnswerIndex = parseInt(q.correctAnswer.charCodeAt(0) - 65);
                const selectedAnswerIndex = answers[index];
                if (selectedAnswerIndex === correctAnswerIndex) {
                  optionStyle = styles.correctOption;
                } else if (oIndex === correctAnswerIndex) {
                  optionStyle = styles.correctOption;
                } else if (oIndex === selectedAnswerIndex) {
                  optionStyle = styles.wrongOption;
                }
              }

              return (
                <TouchableOpacity
                  key={oIndex}
                  style={[
                    optionStyle,
                    !submitted && answers[index] === oIndex ? styles.selectedOption : null
                  ]}
                  onPress={() => !submitted && handleAnswerSelect(index, oIndex )}
                >
                  <Text>{`${String.fromCharCode(65 + oIndex)}: ${option}`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitAnswers}
          disabled={loading || submitted}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Answers</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: '#f7f7f7'
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2ecc71' // Green
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555'
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
    borderColor: '#2ecc71', // Green
    borderWidth: 1
  },
  selectedOption: {
    backgroundColor: '#d3f8d3',
  },
  correctOption: {
    backgroundColor: '#2ecc71', 
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#2ecc71', // Green
    borderWidth: 1
  },
  wrongOption: {
    backgroundColor: '#f8d7da',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#2ecc71', // Green
    borderWidth: 1
  },
  scoreText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2ecc71' // Green
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  submitButton: {
    backgroundColor: '#2ecc71', // Green
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 18,
    color: '# fff',
    textAlign: 'center',
  },
});

export default QuizDetail;