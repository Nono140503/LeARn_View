import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../../../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../../firebase';
import themeContext from '../../../components/ThemeContext';

const TestDetail = ({ route, navigation }) => {
  const { test, attempts } = route.params;
  const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useContext(themeContext);
  const studentId = auth.currentUser.uid;

  // Countdown State
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const fetchAnswers = async () => {
      const testAttemptsRef = doc(db, 'testAttempts', `${test.id}_${studentId}`);
      const docSnapshot = await getDoc(testAttemptsRef);

      if (docSnapshot.exists()) {
        const attemptsData = docSnapshot.data();
        setAnswers(attemptsData.answers || Array(test.questions.length).fill(null));
      }
    };

    fetchAnswers();

    // Convert duration to seconds
    const durationParts = test.duration.split(':');
    const durationInSeconds = parseInt(durationParts[0]) * 3600 + parseInt(durationParts[1]) * 60 + parseInt(durationParts[2]);
    setRemainingTime(durationInSeconds);

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerId);
          Alert.alert('Time Over', 'The time for this test has expired.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('TestList'), // Navigate back to the test list
            },
          ]);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [test.duration, navigation]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle option selection for MCQ and True/False
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  // Handle input answer for input type questions
  const handleInputChange = (questionIndex, text) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = text;
    setAnswers(updatedAnswers);
  };

  // Submit answers and calculate score
  const submitAnswers = async () => {
    if (answers.includes(null)) {
      Alert.alert('Validation Error', 'Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    let calculatedScore = 0;

    test.questions.forEach((q, index) => {
      const selectedAnswer = answers[index];
      const correctAnswer = q.correctAnswer;

      if (q.type === 'MCQ' || q.type === 'True/False') {
        if (selectedAnswer === correctAnswer) {
          calculatedScore += 1;
        }
      } else if (q.type === 'Input') {
        if (selectedAnswer && selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          calculatedScore += 1;
        }
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
    Alert.alert(
      'Test Completed',
      `You scored ${calculatedScore} out of ${test.questions.length}`,
      [{ text: 'OK', onPress: () => navigation.navigate('Test List') }] // Navigate back to the test list after submission
    );

    const testAttemptsRef = doc(db, 'testAttempts', `${test.id}_${studentId}`);
    const docSnapshot = await getDoc(testAttemptsRef);

    if (docSnapshot.exists()) {
      const attemptsData = docSnapshot.data();
      const currentAttempts = attemptsData.attempts || [];

      if(currentAttempts.length < 1)
      {
        Alert.alert("Attempts exhausted!", "You can no longer attempt this test")
        setLoading(false)
        return;
      }


      const updatedAttempts = [...attemptsData.attempts, calculatedScore];
      await updateDoc(testAttemptsRef, { 
        attempts: updatedAttempts, 
        answers: answers, 
      });
    } else {
      await setDoc(testAttemptsRef, { 
        testId: test.id, 
        studentId, 
        attempts: [calculatedScore], 
        answers: answers, 
      });
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text style={styles.countdown}>{formatTime(remainingTime)}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{test.title}</Text>
        {test.questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={[styles.question, {color: theme.color}]}>{`Q${index + 1}: ${q.question}`}</Text>
            {q.type === 'MCQ' || q.type === 'True/False' ? (
              q.options.map((option, oIndex) => {
                const isSelected = answers[index] === oIndex;
                const isCorrect = oIndex === parseInt(q.correctAnswer);
                const optionStyle = submitted ? (isCorrect ? styles.correctOption : (isSelected ? styles.wrongOption : styles.optionButton)) : styles.optionButton;

                return (
                  <TouchableOpacity
                    key={oIndex}
                    style={optionStyle}
                    onPress={() => !submitted && handleAnswerSelect(index, oIndex)}
                  >
                    <Text style={isSelected ? styles.selectedText : styles.optionText}>{`${String.fromCharCode(65 + oIndex)}: ${option}`}</Text>
                    {isSelected && <Text style={styles.radioSelected}> ● </Text>}
                  </TouchableOpacity>
                );
              })
            ) : (
              <TextInput
                style={[styles.input, {color: theme.color}]}
                placeholder="Your answer..."
                placeholderTextColor={theme.placeholderTextColor}
                onChangeText={(text) => handleInputChange(index, text)}
                editable={!submitted}
                value={answers[index] || ''} // Show previous answer if available
              />
            )}
          </View>
        ))}
      </ScrollView>
        
      <View style={styles.buttonContainer}>
        <Button title="Submit Answers" onPress={submitAnswers} disabled={loading || submitted} /> 
      </View>

      {score !== null && (
        <Text style={styles.scoreText}>You scored: {score} / {test.questions.length}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  countdown: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
  },
  radioSelected: {
    marginLeft: 10,
    color: 'green',
  },
  correctOption: {
    backgroundColor: '#d4edda',
  },
  wrongOption: {
    backgroundColor: '#f8d7da',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
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

export default TestDetail;
