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
import { useFocusEffect } from '@react-navigation/native';
import OkAlert from '../../../components/OkAlert'; // Ensure this path is correct

const TestCreator = ({ navigation }) => {
  const [testTitle, setTestTitle] = useState('');
  const [duration, setDuration] = useState('01:00:00');
  const [questions, setQuestions] = useState([{ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [loading, setLoading] = useState(false);
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [unlockTime, setUnlockTime] = useState({ hours: '12', minutes: '00' });
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState({ hours: '12', minutes: '00' });
  
  const [showUnlockDatePicker, setShowUnlockDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (testTitle === '' && questions.every(q => q.question === '')) {
          // Allow exit without confirmation
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Show alert
        setAlertTitle('Discard changes?');
        setAlertMessage('You have unsaved changes. Are you sure you want to discard them and leave the screen?');
        setShowAlert(true);
      });

      return unsubscribe;
    }, [navigation, testTitle, questions])
  );

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: '',
      options: type === 'mcq' ? ['', '', '', ''] : [],
      correctAnswer: type === 'mcq' ? '' : undefined,
      correctToF: type === 'ToF' ? '' : undefined,
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
    if (!testTitle.trim()) {
      setAlertTitle('Validation Error');
      setAlertMessage('Please enter a test title.');
      setShowAlert(true);
      return false;
    }

    if (!duration) {
      setAlertTitle('Validation Error ');
      setAlertMessage('Please select a duration.');
      setShowAlert(true);
      return false;
    }

    if (questions.every((q) => q.question.trim() === '')) {
      setAlertTitle('Validation Error');
      setAlertMessage('Please enter at least one question.');
      setShowAlert(true);
      return false;
    }

    for (const question of questions) {
      if (question.type === 'mcq' && !question.correctAnswer) {
        setAlertTitle('Validation Error');
        setAlertMessage('Please select a correct answer for each multiple-choice question.');
        setShowAlert(true);
        return false;
      }
    }

    return true;
  };

  const saveTest = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const testRef = collection(db, 'tests');
      await addDoc(testRef, {
        title: testTitle,
        duration,
        questions,
        unlockDate,
        unlockTime,
        dueDate,
        dueTime,
      });

      setAlertTitle('Test Saved');
      setAlertMessage(`Title: ${testTitle}`);
      setShowAlert(true);

      // Reset form
      setTestTitle('');
      setDuration('01:00:00');
      setQuestions([{ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '' }]);
      setUnlockDate(new Date());
      setUnlockTime({ hours: '12', minutes: '00' });
      setDueDate(new Date());
      setDueTime({ hours: '12', minutes: '00' });
    } catch (error) {
      console.error('Error saving test:', error);
      setAlertTitle('Error');
      setAlertMessage('Could not save test. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertOk = () => {
    setShowAlert(false);
    if (alertTitle === 'Discard changes?') {
      navigation.dispatch(navigation.getState().routes[0].key);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Create a Test</Text>
        <TextInput
          style={styles.input}
          placeholder="Test title"
          value={testTitle}
          onChangeText={setTestTitle}
          placeholderTextColor="#4a7a5d"
        />
        <Text style={styles.inputLabel}>Select Duration:</Text>
        <Picker
          selectedValue={duration}
          style={styles.picker}
          onValueChange={(itemValue) => setDuration(itemValue)}
        >
          <Picker.Item label="30 minutes" value="00:30:00" />
          <Picker.Item label="1 hour" value="01:00:00" />
          <Picker.Item label="1 hour 30 minutes" value="01:30:00" />
          <Picker.Item label="2 hours" value="02:00:00" />
        </Picker>

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
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, hours: itemValue }))}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={unlockTime.minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setUnlockTime((prev) => ({ ...prev, minutes: itemValue }))}
          >
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
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, hours: itemValue }))}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={dueTime.minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setDueTime((prev) => ({ ...prev, minutes: itemValue }))}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item label={`${i.toString().padStart(2, '0')}`} value={i.toString().padStart(2, '0')} key={i} />
            ))}
          </Picker>
        </View>

        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Question ${index + 1}`}
              value={question.question}
              onChangeText={(text) => updateQuestion(index, 'question', text)}
              placeholderTextColor="#4a7a5d"
            />
            {question.type === 'mcq' && (
              <>
                {question.options.map((option, optIndex) => (
                  <TextInput
                    key={optIndex}
                    style={styles.input}
                    placeholder={`Option ${optIndex + 1}`}
                    value={option}
                    onChangeText={(text) => updateOption(index, optIndex, text)}
                    placeholderTextColor="#4a7a5d"
                  />
                ))}
                <TextInput
                  style={styles.input}
                  placeholder="Correct answer"
                  value={question.correctAnswer}
                  onChangeText={(text) => updateQuestion(index, 'correctAnswer', text)}
                  placeholderTextColor="#4a7a5d"
                />
              </>
            )}
            {question.type === 'ToF' && (
              <Picker
                selectedValue={question.correctToF}
                style={styles.picker}
                onValueChange={(itemValue) => updateQuestion(index, 'correctToF', itemValue)}
              >
                <Picker.Item label="True" value="true" />
                <Picker.Item label="False" value="false" />
              </Picker>
            )}
            {question.type === 'input' && (
              <TextInput
                style={styles.input}
                placeholder="Suggested answer"
                value={question.suggestedAnswer}
                onChangeText={(text) => updateQuestion(index, 'suggestedAnswer', text)}
                placeholderTextColor="#4a7a5d"
              />
            )}
            <Button title="Remove Question" onPress={() => removeQuestion(index)} color="red" />
          </View>
        ))}

<View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => addQuestion('mcq')}>
            <Text style={styles.buttonText}>Add MCQ Question</Text>
          </TouchableOpacity>
       
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={saveTest} 
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>Save Test</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#2e7d32" />}
      </ScrollView>

      <OkAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onOk={() => setShowAlert(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f7f1',
    paddingTop: 36,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  input: {
    borderColor: '#4caf50',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#2e7d32',
  },
  inputLabel: {
    marginVertical: 8,
    color: '#2e7d32',
    fontWeight: '600',
  },
  dateText: {
    padding: 12,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
    color: '#2e7d32',
  },
  timePickerContainer: {
    flexDirection: 'row',
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
tpicker: {
  height: 50,
  width: '80%',
  marginBottom: 16,
  color: '#2e7d32',
  backgroundColor: '#ffffff',
},
picker: {
    height: 50,
    width: '40%',
    marginBottom: 16,
    color: '#2e7d32',
    backgroundColor: '#ffffff',
},
buttonContainer: {
    gap: 12,
    marginVertical: 16,
},
addButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
},
buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
},
saveButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
},
saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
},
disabledButton: {
    backgroundColor: '#a5d6a7',
    opacity: 0.7,
}
});

export default TestCreator;