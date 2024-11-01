<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
>>>>>>> parent of cda7e02 (Added Changes)
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../../firebase';

const TestList = ({ navigation }) => {
<<<<<<< HEAD
  const [tests, setTests] = useState([]);
  const [attemptsData, setAttemptsData] = useState({});
  const studentId = auth.currentUser.uid;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const testsCollection = collection(db, 'tests');
        const testSnapshot = await getDocs(testsCollection);
        const testList = testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTests(testList);

        const attemptsQuery = query(collection(db, 'testAttempts'), where('studentId', '==', studentId));
        const attemptsSnapshot = await getDocs(attemptsQuery);
        const attempts = {};
        attemptsSnapshot.docs.forEach(doc => {
          attempts[doc.data().testId] = doc.data().attempts;
=======
    const [tests, setTests] = useState([]);
    const [attemptsData, setAttemptsData] = useState({});
    const studentId = auth.currentUser.uid;
  
    useEffect(() => {
      const fetchTests = async () => {
        try {
          const testsCollection = collection(db, 'tests');
          const testSnapshot = await getDocs(testsCollection);
          const testList = testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTests(testList);
  
          const attemptsQuery = query(collection(db, 'testAttempts'), where('studentId', '==', studentId));
          const attemptsSnapshot = await getDocs(attemptsQuery);
          const attempts = {};
          attemptsSnapshot.docs.forEach(doc => {
            attempts[doc.data().testId] = doc.data().attempts;
          });
          setAttemptsData(attempts);
        } catch (error) {
          console.error("Error fetching tests:", error);
          Alert.alert('Error', 'Could not retrieve tests. Please try again later.');
        }
      };
  
      fetchTests();
  
      // Live update interval
      const intervalId = setInterval(() => {
        setTests(prevTests => {
          return prevTests.map(test => {
            const currentTime = new Date();
            const unlockDate = new Date(test.unlockDate);
            const dueDate = new Date(test.dueDate);
            return {
              ...test,
              isTestAvailable: currentTime >= unlockDate && currentTime <= dueDate
            };
          });
>>>>>>> parent of cda7e02 (Added Changes)
        });
        setAttemptsData(attempts);
      } catch (error) {
        console.error("Error fetching tests:", error);
        Alert.alert('Error', 'Could not retrieve tests. Please try again later.');
      }
    };

    fetchTests();

    // Live update interval
    const intervalId = setInterval(() => {
      setTests(prevTests => {
        return prevTests.map(test => {
          const currentTime = new Date();
          const unlockDate = new Date(test.unlockDate);
          const dueDate = new Date(test.dueDate);
          return {
            ...test,
            isTestAvailable: currentTime >= unlockDate && currentTime <= dueDate
          };
        });
      });
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const handleTestPress = (test) => {
    const attempts = attemptsData[test.id] || [];
    if (attempts.length >= 1) {
      Alert.alert('Attempt exhausted', 'You have already taken this test.');
    } else {
      navigation.navigate('Test Details', { test, attempts });
    }
  };

  const renderItem = ({ item }) => {
    const attempts = attemptsData[item.id] || [];
    const attemptsLeft = 1 - attempts.length; // Only 1 attempt allowed

    return (
      <View style={styles.testContainer}>
        <Text style={styles.testTitle}>{item.title}</Text>
        <Text style={styles.testInfo}>Duration: {item.duration}</Text>
        <Text style={styles.testInfo}>Unlock Date: {new Date(item.unlockDate).toLocaleString()}</Text>
        <Text style={styles.testInfo}>Due Date: {new Date(item.dueDate).toLocaleString()}</Text>
        <Text style={styles.testInfo}>Attempts left: {attemptsLeft}</Text>
        <Button
          title={item.isTestAvailable && attemptsLeft > 0 ? "Take Test" : "Not Available"}
          onPress={() => item.isTestAvailable && handleTestPress(item)}
          disabled={!item.isTestAvailable || attemptsLeft === 0}
          style={styles.button}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Tests</Text>
      <FlatList
        data={tests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#08A750'
  },
  testContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#08A750',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  testInfo: {
    fontSize: 14,
    color: '#555',
  },
});

export default TestList;
