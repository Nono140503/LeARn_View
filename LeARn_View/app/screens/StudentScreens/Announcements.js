import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../../../firebase';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [tests, setTests] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch announcements
        const announcementSnapshot = await getDocs(collection(db, 'announcements'));
        const announcementList = announcementSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(announcementList);

        // Fetch tests
        const testSnapshot = await getDocs(collection(db, 'tests'));
        const testList = testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch quizzes
        const quizSnapshot = await getDocs(collection(db, 'quizzes'));
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch user's attempts to filter tests and quizzes
        const attemptsQuery = query(collection(db, 'testAttempts'), where('studentId', '==', userId));
        const attemptsSnapshot = await getDocs(attemptsQuery);
        const attemptedTests = attemptsSnapshot.docs.map(doc => doc.data().testId);
        
        // Get the current date and time
        const currentTime = new Date();

        // Filter out already attempted tests and those that are past due
        const filteredTests = testList.filter(test => {
          const dueDate = new Date(test.dueDate);
          return !attemptedTests.includes(test.id) && currentTime <= dueDate;
        });

        const filteredQuizzes = quizList.filter(quiz => {
          const dueDate = new Date(quiz.dueDate);
          return !attemptedTests.includes(quiz.id) && currentTime <= dueDate; // Assuming quizzes also have dueDate
        });

        setTests(filteredTests);
        setQuizzes(filteredQuizzes);

      } catch (error) {
        Alert.alert('Error', 'Failed to load data.');
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (announcementId) => {
    try {
      const announcementRef = doc(db, 'announcements', announcementId);
      const updatedAnnouncement = announcements.find(a => a.id === announcementId);
      if (!updatedAnnouncement.readBy.includes(userId)) {
        updatedAnnouncement.readBy.push(userId);
        await updateDoc(announcementRef, { readBy: updatedAnnouncement.readBy });
        Alert.alert('Marked as read');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as read.');
    }
  };

  const renderAnnouncementItem = ({ item }) => {
    const isRead = item.readBy.includes(userId);

    return (
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementText}>{item.announcement}</Text>
        <Text style={styles.dateText}>{new Date(item.timestamp).toLocaleDateString()}</Text>
        <TouchableOpacity
          style={[styles.button, isRead ? styles.buttonRead : styles.buttonMarkAsRead]}
          onPress={() => markAsRead(item.id)}
          disabled={isRead}
        >
          <Text style={styles.buttonText}>{isRead ? "Read" : "Mark as Read"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTestItem = ({ item }) => (
    <View style={styles.testContainer}>
      <Text style={styles.testTitle}>{item.title}</Text>
      <Text>Duration: {item.duration}</Text>
    </View>
  );

  const renderQuizItem = ({ item }) => (
    <View style={styles.quizContainer}>
      <Text style={styles.quizTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Announcements</Text>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
        keyExtractor={item => item.id}
      />
      <Text style={styles.header}>New Tests</Text>
      <FlatList
        data={tests}
        renderItem={renderTestItem}
        keyExtractor={item => item.id}
      />
      <Text style={styles.header}>New Quizzes</Text>
      <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#227d39',
  },
  announcementContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  announcementText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonMarkAsRead: {
    backgroundColor: '#227d39',
  },
  buttonRead: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  testContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  testTitle: {
    fontSize: 18,
  },
  quizContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  quizTitle: {
    fontSize: 18,
  },
});

export default AnnouncementPage;
