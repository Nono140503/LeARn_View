import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where, getDoc, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { Audio } from 'expo-av';
import { EventRegister } from 'react-native-event-listeners';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import themeContext from '../../../components/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [clearedAnnouncements, setClearedAnnouncements] = useState(new Set())
  const [tests, setTests] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [notificationSound, setNotificationSound] = useState(null)
  const [sound, setSound] = useState()

  const [showAnnouncements, setShowAnnouncements] = useState(true);
  const [showTests, setShowTests] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(true);

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

  // Separate listeners for real-time updates in each category
  useEffect(() => {
    const announcementListener = onSnapshot(collection(db, 'announcements'), (snapshot) => {
        const newAnnouncements = snapshot.docChanges().filter(change => change.type === 'added');
        if (newAnnouncements.length > 0) {
            playSound();
        }
    });

    const testListener = onSnapshot(collection(db, 'tests'), (snapshot) => {
        const newTests = snapshot.docChanges().filter(change => change.type === 'added');
        
    });

    const quizListener = onSnapshot(collection(db, 'quizzes'), (snapshot) => {
        const newQuizzes = snapshot.docChanges().filter(change => change.type === 'added');
        
    });

    return () => {
        announcementListener();
        // testListener();
        // quizListener();
    };
  }, [notificationSound]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch announcements
            const announcementSnapshot = await getDocs(collection(db, 'announcements'));
            const announcementList = announcementSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(announcementList);

            // Fetch tests and quizzes
            const testSnapshot = await getDocs(collection(db, 'tests'));
            const quizSnapshot = await getDocs(collection(db, 'quizzes'));
            const testList = testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Set fetched data
            setTests(testList);
            setQuizzes(quizList);
        } catch (error) {
            Alert.alert('Error', 'Failed to load data.');
        }
    };

    fetchData();
}, []);

  const toggleAnnouncements = () => setShowAnnouncements(!showAnnouncements);
  const toggleTests = () => setShowTests(!showTests);
  const toggleQuizzes = () => setShowQuizzes(!showQuizzes);

  // Clear all notifications
  const clearNotifications = () => {
    setClearedAnnouncements(new Set(announcements.map(ann => ann.id)))
  }
  
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

  // Mark as Read
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

    if(clearedAnnouncements.has(item.id)) return null;

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

  const renderTestItem = ({ item }) => {

  return (
    <ScrollView>
      <View style={[styles.testContainer, {backgroundColor: theme.backgroundColor}]}>
      
      <View style={styles.overlay} />
      <View style={styles.testContent}>
        <Text style={[styles.textShadow, styles.testTitle, {color: theme.color}]}>{item.title}</Text>
        <Text style={[styles.textShadow, styles.infoText, {color: theme.color}]}>Duration: {item.duration} minutes</Text>
        <Text style={[styles.textShadow, styles.infoText, {color: theme.color}]}>Unlock Date: {new Date(item.unlockDate).toLocaleString()}</Text>
        <Text style={[styles.textShadow, styles.infoText, {color: theme.color}]}>Due Date: {new Date(item.dueDate).toLocaleString()}</Text>
      </View>
     
    </View>
    </ScrollView>
  );
};

const renderQuizItem = ({ item }) => {

  return (
    <ScrollView>
      <View style={[styles.quizContainer, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.overlay} />
      <View style={styles.quizContent}>
          <Text style={[styles.textShadow,styles.quizTitle, {color: theme.color}]}>{item.title}</Text>
          <Text style={[styles.textShadow,styles.infoText, {color: theme.color}]}>Duration: {item.duration} minutes</Text>
          <Text style={[styles.textShadow,styles.infoText, {color: theme.color}]}>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      
      <TouchableOpacity onPress={clearNotifications} style={styles.clearNotiBtn}>
        <Text style={styles.clearHeader}>Clear</Text>      
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAnnouncements}>
        <Text style={styles.header}>Announcements</Text>
      </TouchableOpacity>
      {showAnnouncements && (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncementItem}
          keyExtractor={item => item.id}
        />
      )}

      <TouchableOpacity onPress={toggleTests}>
        <Text style={styles.header}>New Tests</Text>
      </TouchableOpacity>
      {showTests && (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
          keyExtractor={item => item.id}
        />
      )}

      <TouchableOpacity onPress={toggleQuizzes}>
        <Text style={styles.header}>New Quizzes</Text>
      </TouchableOpacity>
      {showQuizzes && (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={item => item.id}
        />
      )}
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
  testContent:{
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 5,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  quizContent:{
    backgroundColor: 'skyblue',
    borderRadius: 10,
    padding: 5,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearNotiBtn:{
    backgroundColor: 'green',
    width: 'auto',
    height: 'auto',
    marginRight: 10,
    marginLeft: 'auto',
    padding: 5,
  },
  clearHeader:{
    color: '#FFF',
    textAlign: 'center',
  },
});

export default AnnouncementPage;