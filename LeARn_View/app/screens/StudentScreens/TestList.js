import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../../firebase';

const TestList = ({ navigation }) => {
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
        <ImageBackground
          source={item.image}
          style={styles.imageBackground}
          imageStyle={styles.imageBorderRadius}
        >
          <View style={styles.overlay} />
          <View style={styles.testContent}>
            <Text style={[styles.textShadow, styles.testTitle]}>{item.title}</Text>
            <Text style={[styles.textShadow, styles.infoText]}>Duration: {item.duration} minutes</Text>
            <Text style={[styles.textShadow, styles.infoText]}>Unlock Date: {new Date(item.unlockDate).toLocaleString()}</Text>
            <Text style={[styles.textShadow, styles.infoText]}>Due Date: {new Date(item.dueDate).toLocaleString()}</Text>
            <Text style={[styles.textShadow, styles.attemptsText, attemptsLeft === 0 && styles.attemptsExhausted]}>
              Attempts left: {attemptsLeft}
            </Text>
          </View>
        </ImageBackground>
        <TouchableOpacity
          style={[
            styles.testButton,
            { backgroundColor: attemptsLeft > 0 ? '#4CAF50' : '#999' },
          ]}
          onPress={() => handleTestPress(item)}
          disabled={attemptsLeft === 0}
        >
          <Text style={styles.testButtonText}>
            {attemptsLeft > 0 ? 'Take Test' : 'No Attempts Left'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Tests</Text>
      <FlatList data={tests} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  testContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageBackground: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  imageBorderRadius: {
    borderRadius: 10,
  },

  testContent: {
    padding: 15,
  },

  textShadow: {
    textShadowColor: 'black', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2, 
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
  },
  attemptsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  attemptsExhausted: {
    color: '#FF5252',
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestList;