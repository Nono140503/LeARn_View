import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddAnnouncementScreen = ({ navigation, route }) => {
  const [announcement, setAnnouncement] = useState('');

  const handleAddAnnouncement = () => {
    if (announcement.trim()) {
      route.params.addAnnouncement(announcement); 
      navigation.goBack(); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add New Announcement</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your announcement"
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
  addText:{
    color:'white',
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
