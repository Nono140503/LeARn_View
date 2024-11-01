import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Ensure correct Firebase config
import LecturerBottomTab from '../../../components/LecturerBottomTabBar';
import themeContext from '../../../components/ThemeContext';

const FeedbackScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('Feedback Screen');

  const theme = useContext(themeContext)

  // Fetch announcements from Firestore on mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const fetchedAnnouncements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(fetchedAnnouncements);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  // Function to delete an announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id)); // Deletes the announcement from Firestore
      Alert.alert('Success', 'Announcement deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the announcement.');
    }
  };

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={styles.headerText}>Feedback & Communication</Text>
        <Text style={styles.subHeaderText}>Announcements</Text>

        <ScrollView style={styles.announcementContainer}>
          {announcements.map((announcement) => (
            <View style={styles.announcementBox} key={announcement.id}>
              <Ionicons name="chatbubbles-outline" size={30} color="green" style={styles.icon} />
              <View style={styles.announcementTextContainer}>
                <Text style={styles.announcementText}>
                  {announcement.announcement}
                </Text>
              </View>
              {/* Delete button */}
              <TouchableOpacity
                onPress={() => handleDeleteAnnouncement(announcement.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Add Announcement')}
        >
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <LecturerBottomTab 
        navigation={navigation} 
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginTop: 20,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C7BF2',
    marginTop: 10,
    marginLeft: 10,
  },
  announcementContainer: {
    flexGrow: 1,
  },
  announcementBox: {
    flexDirection: 'row',
    backgroundColor: '#E5F5E0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8, 
    shadowRadius: 3,
  },
  icon: {
    marginRight: 15,
  },
  announcementTextContainer: {
    flex: 1,
  },
  announcementText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default FeedbackScreen;
