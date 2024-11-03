import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import YesNoAlert from '../../../components/YesNoAlert'; // Adjust the import path as necessary

const QuizDetail = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const studentId = auth.currentUser .uid;

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

  const handleLeaveQuiz = async () => {
    const quizAttemptsRef = doc(db, 'quizAttempts', `${quiz.id}_${studentId}`);
    const docSnapshot = await getDoc(quizAttemptsRef);

    if (docSnapshot.exists()) {
      const attemptsData = docSnapshot.data().attempts;
      await updateDoc(quizAttemptsRef, { attempts: [...attemptsData, -1] });
    } else {
      await setDoc(quizAttemptsRef, { quizId: quiz.id, studentId, attempts: [-1] });
    }

    setIsAlertVisible(false); // Close the alert
    navigation.goBack(); // Navigate back
  };

  const handleCancelLeave = () => {
    setIsAlertVisible(false); // Close the alert
  };

  useFocusEffect(
    useCallback(() => {
      const handleLeaveWarning = (e) => {
        if (!submitted && !isAlertVisible) {
          e.preventDefault(); // Prevent the default back action
          setIsAlertVisible(true); // Show the custom alert
        }
      };

      const unsubscribe = navigation.addListener('beforeRemove', handleLeaveWarning);

      return () => {
        unsubscribe();
      };
    }, [submitted, navigation, isAlertVisible])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{quiz.title}</Text>
        <Text style={styles.details}>Duration: {quiz.duration}</Text>
        <Text style={styles.details}>Due Date: {new Date(quiz.dueDate.seconds * 1000).toLocaleDateString()} {quiz.dueTime.hours}:{quiz.dueTime.minutes}</Text>
        <Text style={styles.details}>Unlock Date: {new Date(quiz.unlockDate.seconds * 1000).toLocaleDateString()} {quiz.unlockTime.hours}:{quiz.unlockTime.minutes}</Text>

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

      <YesNoAlert
        visible={isAlertVisible}
        title="Warning"
        message="You have not submitted your answers. Leaving will deduct an attempt. Are you sure you want to leave?"
        onYes={handleLeaveQuiz}
        onNo={handleCancelLeave}
      />
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
  },
  correctOption: {
    backgroundColor: '#c8e6c9',
  },
  wrongOption: {
    backgroundColor: '#ffcdd2',
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
