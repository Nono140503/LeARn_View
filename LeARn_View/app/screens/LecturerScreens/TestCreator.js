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

const TestCreator = () => {
  const [testTitle, setTestTitle] = useState('');
  const [duration, setDuration] = useState('01:00:00');
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
    if (!testTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a test title.');
      return false;
    }

    if (!duration) {
      Alert.alert('Validation Error', 'Please select a duration for the test.');
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

  const saveTest = async () => {
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

      const testData = {
        title: testTitle,
        duration,
        questions,
        unlockDate: unlockDateTime.toISOString(),
        dueDate: dueDateTime.toISOString(),
      };
      await addDoc(collection(db, 'tests'), testData);
      Alert.alert('Test Saved', `Title: ${testTitle}`, [{ text: 'OK' }]);

      setTestTitle('');
      setDuration('01:00:00');
      setQuestions([{ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '' }]);
      setUnlockDate(new Date());
      setUnlockTime({ hours: '12', minutes: '00' });
      setDueDate(new Date());
      setDueTime({ hours: '12', minutes: '00' });
    } catch (error) {
      console.error('Error saving test:', error);
      Alert.alert('Error', 'Could not save test. Please try again.', [{ text: 'OK' }]);
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
        <Text style={styles.header}>Create a Test</Text>
        <TextInput
          style={styles.input}
          placeholder="Test title"
          value={testTitle}
          onChangeText={setTestTitle}
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

        {questions.map((q, qIndex) => (
          <View key={qIndex} style={styles.questionContainer}>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={q.question}
              onChangeText={(value) => updateQuestion(qIndex, 'question', value)}
            />
            {q.type === 'mcq' && (
              <>
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
              </>
            )}
            {q.type === 'truefalse' && (
              <Picker
                selectedValue={q.correctAnswer}
                style={styles.picker}
                onValueChange={(itemValue) => updateQuestion(qIndex, 'correctAnswer', itemValue)}
              >
                <Picker.Item label="Select correct answer" value="" />
                <Picker.Item label="True" value="true" />
                <Picker.Item label="False" value="false" />
              </Picker>
            )}
            {q.type === 'input' && (
              <TextInput
                style={styles.input}
                placeholder="Suggested Answer"
                value={q.suggestedAnswer}
                onChangeText={(value) => updateQuestion(qIndex, 'suggestedAnswer', value)}
              />
            )}
            <Button title="Remove Question" color="red" onPress={() => removeQuestion(qIndex)} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="+ Add MCQ Question" onPress={() => addQuestion('mcq')} />
        <Button title="+ Add True/False Question" onPress={() => addQuestion('truefalse')} />
        <Button title="+ Add Input Question" onPress={() => addQuestion('input')} />
        <Button title="Save and Upload" onPress={saveTest} disabled={loading} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  scrollView: {
    paddingBottom: 20,
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
  inputLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  dateText: {
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '32%',
  },
  questionContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default TestCreator;
