import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { Audio } from 'expo-av';
import { EventRegister } from 'react-native-event-listeners';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import themeContext from '../../../components/ThemeContext';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [tests, setTests] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [notificationSound, setNotificationSound] = useState(null)
  const [sound, setSound] = useState()
  const theme = useContext(themeContext)
  const userId = auth.currentUser.uid;
  const user = auth.currentUser

  // Fetch and set notification sound
  const fetchAndSetNotificationSound = async () => {
    if(!user) return;
        
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if(userDoc.exists())
    {
        const soundFileName = userDoc.data().notificationSound;
        const storage = getStorage();
        const storageRef = ref(storage, soundFileName);
        const downloadURL = await getDownloadURL(storageRef);

        setNotificationSound(downloadURL);
        console.log("Fetched sound:", downloadURL);
    }
  }

  // Play Sound
  const playSound = async () => {
    if(notificationSound)
    {

        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync({uri: notificationSound})
        setSound(sound)
        await sound.playAsync()
    }
  }

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

    // Listen for new Announcements
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
          const newAnnouncements = snapshot.docChanges().filter(change => change.type === 'added');
  
          if (newAnnouncements.length > 0) {
              // Check if notificationSound is set
              if (notificationSound) {
                  playSound();
              } else {
                  console.log("No notification sound URL available.");
              }
          }
        });
  
        return () => unsubscribe();
    }, [notificationSound]);
    
  
    // Fetch Dark mode
    useEffect(() => {
      const fetchUserProfile = async () => {
          const userRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userRef)
  
          if(userDoc.exists())
          {
              const userData = userDoc.data()
              EventRegister.emit('ChangeTheme', userData.darkMode)
          }
      }
  
      fetchUserProfile()
    }, [theme.darkMode])

    // Fetch notification sounds on initial load
    useEffect(() => {
      fetchAndSetNotificationSound();
    }, []);
  
  
    // Reload new notification sound after updating in Notification Settings
    useEffect(() => {
  
        const notificationSoundListener = EventRegister.addEventListener('NotificationSoundChanged', async() => {
          await fetchAndSetNotificationSound();
          playSound()
        })
  
        return () => {
            EventRegister.removeEventListener(notificationSoundListener)
      }
    }, [])

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
    <View style={[styles.quizContainer, {backgroundColor: theme.backgroundColor}]}>
      <Text style={styles.quizTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
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
