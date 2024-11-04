import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const QuizDetail = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const studentId = auth.currentUser.uid;
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const parseDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    setRemainingTime(parseDuration(quiz.duration));

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitAnswers();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.duration]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const saveHighestScore = async (calculatedScore) => {
    const quizScoresRef = doc(db, 'quizScores', studentId);
    const docSnapshot = await getDoc(quizScoresRef);

    const submissionDate = new Date().toISOString();

    try {
      if (docSnapshot.exists()) {
        const scoresData = docSnapshot.data();
        const currentScore = scoresData[quiz.id]?.score || 0;

        if (calculatedScore > currentScore) {
          await updateDoc(quizScoresRef, {
            [quiz.id]: {
              score: calculatedScore,
              totalQuestions: quiz.questions.length,
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
            totalQuestions: quiz.questions.length,
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

    quiz.questions.forEach((q, index) => {
      if (answers[index] === parseInt(q.correctAnswer.charCodeAt(0) - 65)) {
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
    navigation.navigate('Quiz List');
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      const handleLeaveWarning = (e) => {
        if (!submitted && !isAlertVisible) {
          e.preventDefault(); // Prevent the default back action
          setIsAlertVisible(true); // Set alert visibility to true
          
          Alert.alert(
            'Warning',
            'You have not submitted your answers. Leaving will deduct an attempt. Are you sure you want to leave?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => setIsAlertVisible(false) },
              {
                text: 'Leave',
                style: 'destructive',
                onPress: async () => {
                  const quizAttemptsRef = doc(db, 'quizAttempts', `${quiz.id}_${studentId}`);
                  const docSnapshot = await getDoc(quizAttemptsRef);

                  if (docSnapshot.exists()) {
                    const attemptsData = docSnapshot.data().attempts;
                    await updateDoc(quizAttemptsRef, { attempts: [...attemptsData, -1] });
                  } else {
                    await setDoc(quizAttemptsRef, { quizId: quiz.id, studentId, attempts: [-1] });
                  }
                  setIsAlertVisible(false); // Reset alert visibility
                  navigation.goBack(); // Navigate back
                },
              },
            ],
            { cancelable: false }
          );
        }
      };

      const unsubscribe = navigation.addListener('beforeRemove', handleLeaveWarning);

      return () => {
        unsubscribe();
      };
    }, [submitted, navigation, quiz.id, studentId, isAlertVisible]) // Add isAlertVisible to dependencies
  );


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{quiz.title}</Text>
        <Text style={styles.details}>Duration: {quiz.duration}</Text>
        <Text style={styles.details}>Due Date: {quiz.dueDate.toLocaleString()} {quiz.dueTime.hours}:{quiz.dueTime.minutes}</Text>
        <Text style={styles.details}>Unlock Date: {item.dueDate.toLocaleString()} {quiz.unlockTime.hours}:{quiz.unlockTime.minutes}</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time Left: {formatTime(remainingTime)}</Text>
        </View>

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
    backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2ecc71',
    paddingTop: 15,
    left: 0,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  timerContainer: {
    position: 'absolute',
    top: 10, right: 0,
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 5,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#cce5ff',
    backgroundColor: '#cce5ff',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  correctOption: {
    backgroundColor: '#c8e6c9',
    backgroundColor: '#cce5ff',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  wrongOption: {
    backgroundColor: '#ffcdd2',
    backgroundColor: '#cce5ff',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2ecc71',
    marginTop: 20,
  },
});

export default QuizDetail;
