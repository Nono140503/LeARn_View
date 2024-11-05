import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../../firebase';
import { collection, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import themeContext from '../../../components/ThemeContext';

const Assessments = () => {
  const navigation = useNavigation();
  const [tests, setTests] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const theme = useContext(themeContext);

  useEffect(() => {
    const fetchTestsAndQuizzes = async () => {
      try {
        const testsCollection = collection(db, 'tests');
        const testSnapshot = await getDocs(testsCollection);
        const testList = testSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate ? new Date(doc.data().dueDate.seconds * 1000) : null,
          type: 'test'
        }));
        setTests(testList);

        const quizzesCollection = collection(db, 'quizzes');
        const quizSnapshot = await getDocs(quizzesCollection);
        const quizList = quizSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate ? new Date(doc.data().dueDate.seconds * 1000) : null,
          type: 'quiz'
        }));
        setQuizzes(quizList);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert('Error', 'Could not retrieve data. Please try again later.');
      }
    };

    fetchTestsAndQuizzes();
  }, []);

  const handleDelete = async (item) => {
    try {
      const collectionName = item.type === 'test' ? 'tests' : 'quizzes';
      await deleteDoc(doc(db, collectionName, item.id));
      if (item.type === 'test') {
        setTests(prevTests => prevTests.filter(test => test.id !== item.id));
      } else {
        setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== item.id));
      }
      Alert.alert('Success', `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document:", error);
      Alert.alert('Error', 'Could not delete the assessment. Please try again.');
    }
  };

  const handleUpdateDueDate = async (item, newDueDate) => {
    try {
      const collectionName = item.type === 'test' ? 'tests' : 'quizzes';
      await updateDoc(doc(db, collectionName, item.id), {
        dueDate: newDueDate
      });
      if (item.type === 'test') {
        setTests(prevTests => prevTests.map(test => test.id === item.id ? { ...test, dueDate: newDueDate } : test));
      } else {
        setQuizzes(prevQuizzes => prevQuizzes.map(quiz => quiz.id === item.id ? { ...quiz, dueDate: newDueDate } : quiz));
      }
      Alert.alert('Success', 'Due date updated successfully.');
    } catch (error) {
      console.error("Error updating due date:", error);
      Alert.alert('Error', 'Could not update the due date. Please try again.');
    }
  };

  const openDatePicker = (item) => {
    setSelectedItem(item);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      handleUpdateDueDate(selectedItem, selectedDate);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.info}>Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
      <Text style={styles.info}>Duration: {item.duration} minutes</Text>
      <Text style={styles.info}>Due Date: {item.dueDate ? item.dueDate.toLocaleString() : 'N/A'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={() => openDatePicker(item)}>
          <Text style={styles.buttonText}>Update Due Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#227d39" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessments</Text>
      </View>

      <FlatList data={[...tests, ...quizzes]} renderItem={renderItem} keyExtractor={item => item.id} />
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginTop: 20

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  backButton: {
    marginRight: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#227d39'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Assessments;
