import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import GreenOkAlert from '../../../components/OkAlert';

const QuizCreator = ({ navigation }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [duration, setDuration] = useState('00:30:00');
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [showUnlockDatePicker, setShowUnlockDatePicker] = useState(false);
  const [unlockTime, setUnlockTime] = useState({ hours: '00', minutes: '00' });
  const [dueDate, setDueDate] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [dueTime, setDueTime] = useState({ hours: '00', minutes: '00' });
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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
      setAlertTitle('Validation Error');
      setAlertMessage('Please enter a quiz title.');
      setShowAlert(true);
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setAlertTitle('Validation Error');
        setAlertMessage(`Question ${i + 1} is empty. Please fill in the question.`);
        setShowAlert(true);
        return false;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setAlertTitle('Validation Error');
          setAlertMessage(`Option ${String.fromCharCode(65 + j)} for Question ${i + 1} is empty.`);
          setShowAlert(true);
          return false;
        }
      }

      if (q.correctAnswer === '') {
        setAlertTitle('Validation Error');
        setAlertMessage(`Correct answer for Question ${i + 1} is not selected.`);
        setShowAlert(true);
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
      const quizData = { title: quizTitle, duration, unlockDate, unlockTime, dueDate, dueTime, questions };
      await addDoc(collection(db,  'quizzes'), quizData);
      setAlertTitle('Quiz Saved');
      setAlertMessage(`Title: ${quizTitle}`);
      setShowAlert(true);

      // Reset the form after saving
      setQuizTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
      setDuration('00:30:00');
      setUnlockDate(new Date());
      setDueDate(new Date());
      setUnlockTime({ hours: '00', minutes: '00' });
      setDueTime({ hours: '00', minutes: '00' });
    } catch (error) {
      console.error('Error saving quiz:', error);
      setAlertTitle('Error');
      setAlertMessage('Could not save quiz. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_cont}>
        <Icon name='arrow-back-outline' size={30} style={styles.icon} onPress={handleBack} color="#2E7D32" />
        <Text style={styles.heading}>Create a Quiz</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder="Quiz title"
          value={quizTitle}
          onChangeText={setQuizTitle}
          placeholderTextColor="#81C784"
        />
        <Text style={styles.inputLabel}>Select Duration:</Text>
        <Picker
          selectedValue={duration}
          style={[styles.picker, { backgroundColor: '#C8E6C9' }]}
          onValueChange={setDuration}
        >
          <Picker.Item label="30 minutes" value="00:30:00" />
          <Picker.Item label="1 hour" value="01:00:00" />
          <Picker.Item label="1 hour 30 minutes" value="01:30:00" />
          <Picker.Item label="2 hours" value="02:00:00" />
        </Picker>

        <Text style={styles.inputLabel}>Unlock Date:</Text>
        <TouchableOpacity onPress={() => setShowUnlockDatePicker(true)} style={styles.dateButton}>
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
            style={[styles.picker, { backgroundColor: '#C8E6C9' }]}
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, hours: itemValue }))}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={unlockTime.minutes}
            style={[styles.picker, { backgroundColor: '#C8E6C9' }]}
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, minutes: itemValue }))}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Due Date:</Text>
        <TouchableOpacity onPress={() => setShowDueDatePicker(true)} style={styles.dateButton}>
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
            style={[styles.picker, { backgroundColor: '#C8E6C9' }]}
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, hours: itemValue }))}
          >
            {Array.from ({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={dueTime.minutes}
            style={[styles.picker, { backgroundColor: '#C8E6C9' }]}
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, minutes: itemValue }))}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
        </View>

        {questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Question ${index + 1}`}
              value={q.question}
              onChangeText={(text) => updateQuestion(index, 'question', text)}
              placeholderTextColor="#81C784"
            />
            {q.options.map((option, optionIndex) => (
              <TextInput
                key={optionIndex}
                style={styles.input}
                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                value={option}
                onChangeText={(text) => updateOption(index, optionIndex, text)}
                placeholderTextColor="#81C784"
              />
            ))}
            <Picker
              selectedValue={q.correctAnswer}
              style={[styles.tpicker, { backgroundColor: '#C8E6C9' }]}
              onValueChange={(itemValue) => updateQuestion(index, 'correctAnswer', itemValue)}
            >
              <Picker.Item label="Select Correct Answer" value="" />
              {q.options.map((option, optionIndex) => (
                <Picker.Item label={`Option ${String.fromCharCode(65 + optionIndex)}`} value={String.fromCharCode(65 + optionIndex)} key={optionIndex} />
              ))}
            </Picker>
          </View>
        ))}

      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button title="Add Question" onPress={addQuestion} color="#2E7D32" />
        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" />
        ) : (
          <Button title="Save Quiz" onPress={saveQuiz} color="#2E7D32" />
        )}
      </View>

      <GreenOkAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onOk={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop:40,
    backgroundColor: '#A5D6A7',
  },
  header_cont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scrollView: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#388E3C',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#2E7D32',
  },
  inputLabel: {
    marginVertical: 5,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  picker: {
    height: 50,
    width: '50%',
    marginBottom: 10,
  },
  tpicker: {
    height: 50,
    width: '80%',
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    color: '#2E7D32',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '60%',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
});

export default QuizCreator;
