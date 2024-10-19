import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const QuizCreator = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [loading, setLoading] = useState(false);
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [unlockTime, setUnlockTime] = useState({ hours: '12', minutes: '00' });
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState({ hours: '12', minutes: '00' });
  
  // Added visibility states for date pickers
  const [showUnlockDatePicker, setShowUnlockDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: '',
      options: type === 'mcq' ? ['', '', '', ''] : [],
      correctAnswer: type === 'mcq' ? '' : undefined,
      suggestedAnswer: type === 'input' ? '' : undefined,
    };
    setQuestions([...questions, newQuestion]);
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

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
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

      if (q.type === 'mcq') {
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
      } else if (q.type === 'input' && !q.suggestedAnswer.trim()) {
        Alert.alert('Validation Error', `Suggested answer for Question ${i + 1} is empty.`);
        return false;
      }
    }
    return true;
  };

  const saveQuiz = async () => {
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    try {
      const unlockDateTime = new Date(unlockDate);
      unlockDateTime.setHours(unlockTime.hours);
      unlockDateTime.setMinutes(unlockTime.minutes);
  
      const dueDateTime = new Date(dueDate);
      dueDateTime.setHours(dueTime.hours);
      dueDateTime.setMinutes(dueTime.minutes);
  
      // Prepare the quiz data
      const quizData = {
        title: quizTitle.trim(),
        questions: questions.map(q => ({
          ...q,
          options: q.options.map(option => option || ''),
          correctAnswer: q.correctAnswer || '',
          suggestedAnswer: q.suggestedAnswer || ''
        })),
        unlockDate: unlockDateTime.toISOString(),
        dueDate: dueDateTime.toISOString(),
      };
  
      // Only add the document if it contains all required fields
      if (quizData.title && quizData.questions.length > 0) {
        await addDoc(collection(db, 'quizzes'), quizData);
        Alert.alert('Quiz Saved', `Title: ${quizTitle}`, [{ text: 'OK' }]);
  
        // Reset form fields
        setQuizTitle('');
        setQuestions([{ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '' }]);
        setUnlockDate(new Date());
        setUnlockTime({ hours: '12', minutes: '00' });
        setDueDate(new Date());
        setDueTime({ hours: '12', minutes: '00' });
      } else {
        Alert.alert('Error', 'Quiz data is incomplete. Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Could not save quiz. Please try again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Create a Quiz</Text>
        <TextInput
          style={styles.input}
          placeholder="Quiz title"
          value={quizTitle}
          onChangeText={setQuizTitle}
        />

        <Text style={styles.inputLabel}>Unlock Date:</Text>
        <TouchableOpacity onPress={() => setShowUnlockDatePicker(true)}>
          <Text style={styles.dateText}>{unlockDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showUnlockDatePicker && (
          <DateTimePicker
            value={unlockDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowUnlockDatePicker(false);
              if (selectedDate) {
                setUnlockDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.inputLabel}>Unlock Time:</Text>
        <View style={styles.timePickerContainer}>
          <Picker
            selectedValue={unlockTime.hours}
            style={styles.picker}
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, hours: itemValue }))}>
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={unlockTime.minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, minutes: itemValue }))}>
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Due Date:</Text>
        <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
          <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDueDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDueDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.inputLabel}>Due Time:</Text>
        <View style={styles.timePickerContainer}>
          <Picker
            selectedValue={dueTime.hours}
            style={styles.picker}
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, hours: itemValue }))}>
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={dueTime.minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, minutes: itemValue }))}>
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>Questions</Text>
        {questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <TextInput
              style={styles.questionInput}
              placeholder="Question"
              value={q.question}
              onChangeText={(value) => updateQuestion(index, 'question', value)}
            />
            {q.type === 'mcq' && (
              <>
                {q.options.map((option, optionIndex) => (
                  <TextInput
                    key={optionIndex}
                    style={styles.optionInput}
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                    value={option}
                    onChangeText={(value) => updateOption(index, optionIndex, value)}
                  />
                ))}
                <TextInput
                  style={styles.correctAnswerInput}
                  placeholder="Correct Answer (e.g., A, B, C, D)"
                  value={q.correctAnswer}
                  onChangeText={(value) => updateQuestion(index, 'correctAnswer', value)}
                />
              </>
            )}
            <TouchableOpacity onPress={() => removeQuestion(index)}>
              <Text style={styles.removeQuestionText}>Remove Question</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => addQuestion('mcq')}>
            <Text style={styles.buttonText}>+ Add MCQ Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => addQuestion('input')}>
            <Text style={styles.buttonText}>+ Add Input Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveQuiz} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save and Upload'}</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
  },
  questionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  optionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  correctAnswerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  removeQuestionText: {
    color: 'red',
    textAlign: 'right',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default QuizCreator;
