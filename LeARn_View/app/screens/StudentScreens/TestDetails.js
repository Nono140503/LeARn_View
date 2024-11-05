import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';
import YesNoAlert from '../../../components/YesNoAlert'; // Adjust the import path as necessary
import themeContext from '../../../components/ThemeContext';

const TestDetail = ({ route, navigation }) => {
  const { test: testFromParams } = route.params;
  const [test, setTest] = useState({
    ...testFromParams,
    unlockDate: new Date(testFromParams.unlockDate),
    dueDate: new Date(testFromParams.dueDate)
  });
  const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useContext(themeContext);
  const studentId = auth.currentUser .uid;

  // Countdown State
  const [remainingTime, setRemainingTime] = useState(0);
  const timerId = useRef(null); // To store the timer ID

  // State to control the exit confirmation alert
  const [showExitAlert, setShowExitAlert] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      if (!submitted) {
        setShowExitAlert(true); // Show the exit alert
        return true; // Prevent default back button behavior
      }
      return false; // Allow back button if test is submitted
    };

    // Add event listener for back button press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    const initializeTimer = () => {
      const durationParts = test.duration.split(':');
      const durationInSeconds =
        parseInt(durationParts[0]) * 3600 +
        parseInt(durationParts[1]) * 60 +
        parseInt(durationParts[2]);
      setRemainingTime(durationInSeconds);
      startTimer();
    };

    initializeTimer();

    // Clean up the timer and event listener when the component unmounts
    return () => {
      clearInterval(timerId.current);
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [test.duration, navigation]);

  const startTimer = () => {
    timerId.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerId.current);
          handleSubmitAnswers(); // Automatically submit when time is up
          return 0;
        }
        return prevTime - 1; // Update remaining time
      });
    }, 1000);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option selection for MCQ
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = optionIndex;
      return updatedAnswers;
    });
  };

  // Handle input answer for input type questions
  const handleInputChange = (questionIndex, text) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = text;
      return updatedAnswers;
    });
  };

  // Handle selection for True/False questions
  const handleTrueFalseSelect = (questionIndex, selectedValue) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = selectedValue;
      return updatedAnswers;
    });
  };

  // Save highest score function
  const saveHighestScore = async (calculatedScore) => {
    const quizScoresRef = doc(db, 'quizScores', studentId);
    const docSnapshot = await getDoc(quizScoresRef);

    const submissionDate = new Date().toISOString();

    try {
      if (docSnapshot.exists()) {
        const scoresData = docSnapshot.data();
        const currentScore = scoresData[test.id]?.score || 0;

        if (calculatedScore > currentScore) {
          await updateDoc(quizScoresRef, {
            [test.id]: {
              score: calculatedScore,
              totalQuestions: test.questions.length,
              title: `${test.title} Test`,
              submittedAt: submissionDate,
            },
          });
          Alert.alert('Score Updated', `Your new highest score is ${calculatedScore}. Total questions: ${test.questions.length}`);
        } else {
          Alert.alert('Score Not Updated', `Your score of ${calculatedScore} is not higher than your previous score of ${currentScore}. Total questions: ${test.questions.length}`);
        }
      } else {
        await setDoc(quizScoresRef, {
          [test.id]: {
            score: calculatedScore,
            totalQuestions : test.questions.length,
            title: `${test.title} Test`,
            submittedAt: submissionDate,
          },
        });
        Alert.alert('Score Saved', `Your score of ${calculatedScore} has been saved. Total questions: ${test.questions.length}`);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error saving your score. Please try again later.');
      console.error("Error saving score: ", error);
    }
  };

  // Submit answers and calculate score
  const handleSubmitAnswers = async () => {
    if (answers.includes(null)) {
      Alert.alert(
        'Validation Error',
        'Please answer all questions before submitting.',
        [
          {
            text: 'OK',
          },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      // Update Firestore with submitted answers
      const testAttemptsRef = doc(db, 'testAttempts', `${test.id}_${studentId}`);
      await updateDoc(testAttemptsRef, {
        answers,
        submitted: true,
      });

      // Calculate score
      const calculatedScore = answers.reduce((acc, current, index) => {
        if (current === test.questions[index].correctAnswer) {
          return acc + 1;
        }
        return acc;
      }, 0);

      // Save highest score
      await saveHighestScore(calculatedScore);

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  // Handle exit confirmation
  const handleExitYes = () => {
    setShowExitAlert(false);
    navigation.goBack();
  };

  const handleExitNo = () => {
    setShowExitAlert(false);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>{test.title}</Text>
        <Text style={styles.details}>
          Due Date: {test.dueDate ? new Date(test.dueDate).toLocaleString() : 'N/A'} | 
          Unlock Date: {test.unlockDate ? new Date(test.unlockDate).toLocaleString() : 'N/A'} | 
          Due Time: {test.dueTime?.hours || 'N/A'}:{test.dueTime?.minutes || 'N/A'} | 
          Duration: {test.duration}
        </Text>

        {test.questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.question}>{question.question}</Text>

            {question.type === 'mcq' && (
              <View>
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    onPress={() => handleAnswerSelect(index, optionIndex)}
                    style={[
                      styles.optionButton,
                      answers[index] === optionIndex && styles.selectedOption,
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {question.type === 'input' && (
              <TextInput
                style={styles.inputField}
                value={answers[index]}
                onChangeText={(text) => handleInputChange(index, text)}
                placeholder="Enter your answer"
              />
            )}

            {question.type === 'ToF' && (
              <Picker
                selectedValue={answers[index]}
                onValueChange={(itemValue) => handleTrueFalseSelect(index, itemValue)}
              >
                <Picker.Item label="True" value={true} />
                <Picker.Item label="False" value={false} />
              </Picker>
            )}
          </View>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="Submit Answers"
            onPress={handleSubmitAnswers}
            disabled={submitted || loading} // Disable button during loading state
            color={submitted || loading ? '#ccc' : '#2ecc71'} // Change button color during loading state
          />
        </View>
      )}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(remainingTime)}</ Text>
      </View>

      <YesNoAlert
        visible={showExitAlert}
        title="Exit Test?"
        message="Are you sure you want to exit the test? The timer will not reset, and your progress will be saved."
        onYes={handleExitYes}
        onNo={handleExitNo}
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
    top: 40,
    right: 10,
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
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 5,
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
    bottom: 25,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    fontSize: 18,
    color: '#2ecc71',
    marginTop: 10,
  },
});

export default TestDetail;