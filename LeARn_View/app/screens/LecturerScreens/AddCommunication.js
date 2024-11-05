import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../../../firebase'; 
import themeContext from '../../../components/ThemeContext';

const AddAnnouncementScreen = ({ navigation }) => {
  const [announcement, setAnnouncement] = useState('');
  const theme = useContext(themeContext)

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAnnouncement('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddAnnouncement = async () => {
    if (announcement.trim()) {
      try {
        await addDoc(collection(db, 'announcements'), {
          announcement: announcement,
          timestamp: new Date().toISOString(), 
          readBy: [], 
        });
        Alert.alert('Success', 'Announcement added successfully.');
        navigation.goBack(); 
      } catch (error) {
        Alert.alert('Error', 'Failed to add announcement.');
      }
    } else {
      Alert.alert('Validation Error', 'Announcement text cannot be empty.');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text style={styles.headerText}>Add New Announcement</Text>
      <TextInput
        style={[styles.input, {color: theme.color}]}
        placeholder="Enter your announcement"
        placeholderTextColor= {theme.placeholderTextColor}
        value={announcement}
        onChangeText={setAnnouncement}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAnnouncement}>
        <Text style={styles.addText}>Add Announcement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  addText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
  },
});

export default AddAnnouncementScreen;
