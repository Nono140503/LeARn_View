import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import { db } from '../../../firebase'; // Ensure correct db import
import { collection, addDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler';

const QuizCreator = ({navigation}) => {
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
  const handleBack = () =>{
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_cont}>
        <Icon name='arrow-back-outline' size={30} style={styles.icon} onPress={handleBack}/>
        <Text style={styles.heading}>Create a Quiz</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
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
            <Text style={styles.inputLabel}>Select Correct Answer:</Text>
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
        <TouchableOpacity style={styles.addQuestion} onPress={addQuestion}>
            <Text style={styles.buttonText}>Add a Question</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.saveQuiz} onPress={saveQuiz}>
            <Text style={styles.buttonText}>Save and Upload</Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  scrollView: {
    paddingBottom: 80,
    width: '100%',
    paddingTop: 20,
    padding: 20

  },
  buttonText:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  addQuestion:{
    backgroundColor: '#3D8DCB',
    padding: 15,
    borderRadius: 5,
  },
  saveQuiz:{
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
  },
  heading:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 80,
    
  },
  icon:{
    color: 'green',
  },
  header_cont:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 40,
    padding: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.4,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    color: '#3D8DCB',
  },
  input: {
    width: '100%',
    padding: 12,
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
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: '#3D8DCB',
  },
  questionContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default QuizCreator;
