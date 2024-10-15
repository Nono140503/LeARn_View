import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import { db } from '../../../firebase'; // Ensure correct db import
import { collection, addDoc } from 'firebase/firestore'; // Import necessary Firestore functions

const QuizCreator = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    if (!quizTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a quiz title.');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        Alert.alert('Validation Error', `Question ${i + 1} is empty. Please fill in the question.`);
        return false;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          Alert.alert('Validation Error', `Option ${String.fromCharCode(65 + j)} for Question ${i + 1} is empty.`);
          return false;
        }
      }

      if (q.correctAnswer === '') {
        Alert.alert('Validation Error', `Correct answer for Question ${i + 1} is not selected.`);
        return false;
      }
    }

    return true;
  };

  const saveQuiz = async () => {
    if (!validateForm()) {
      return; // Do not proceed if validation fails
    }

    setLoading(true); // Set loading state to true to show the spinner and disable the button
    try {
      const quizData = { title: quizTitle, questions };
      await addDoc(collection(db, 'quizzes'), quizData);
      Alert.alert('Quiz Saved', `Title: ${quizTitle}`, [{ text: 'OK' }]);

      // Reset the form after saving
      setQuizTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Could not save quiz. Please try again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false); // Set loading state back to false once saving is complete
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Create a Quiz</Text>
        <TextInput
          style={styles.input}
          placeholder="Quiz title"
          value={quizTitle}
          onChangeText={setQuizTitle}
        />
        <Text style={styles.header}>Questions:</Text>
        {questions.map((q, qIndex) => (
          <View key={qIndex} style={styles.questionContainer}>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={q.question}
              onChangeText={(value) => updateQuestion(qIndex, 'question', value)}
            />
            {q.options.map((option, oIndex) => (
              <TextInput
                key={oIndex}
                style={styles.input}
                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                value={option}
                onChangeText={(value) => updateOption(qIndex, oIndex, value)}
              />
            ))}
            <Text style={styles.inputLabel}>Select Correct Answer</Text>
            <Picker
              selectedValue={q.correctAnswer}
              style={styles.picker}
              onValueChange={(itemValue) => updateQuestion(qIndex, 'correctAnswer', itemValue)}
            >
              <Picker.Item label="Select correct answer" value="" />
              {q.options.map((option, oIndex) => (
                <Picker.Item
                  key={oIndex}
                  label={`${String.fromCharCode(65 + oIndex)}: ${option}`}
                  value={oIndex.toString()}
                />
              ))}
            </Picker>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="+ Add Question" onPress={addQuestion} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Save and Upload" onPress={saveQuiz} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  scrollView: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  questionContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default QuizCreator;
