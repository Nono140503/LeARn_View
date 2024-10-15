//Settings Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({navigation}) => {
  const handleBack = () =>{
    navigation.goBack();
  }
  const handleLecturer = ()=>{
    navigation.navigate('Lecturer Dashboard');
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name='arrow-back-outline' size={30} style={styles.back_arrow}/>
        </TouchableOpacity>
          
          <Text style={styles.headerText}>Settings</Text>
  
      </View>
     

      <TouchableOpacity style={styles.card}>
        <FontAwesome name="user-circle-o" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardSubtitle}>Username, profile picture</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Ionicons name="notifications-outline" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardSubtitle}>Notification tone</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <MaterialIcons name="settings" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>AR Settings</Text>
          <Text style={styles.cardSubtitle}>Configure AR features</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <MaterialIcons name="settings-applications" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>App Preferences</Text>
          <Text style={styles.cardSubtitle}>Light, Dark, System default theme</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={{}}>
        <MaterialIcons name="logout" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Log Out</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={handleLecturer}>
        <MaterialIcons name="history-edu" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Lecturer</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  back_arrow:{
    color: '#1D7801'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    marginLeft: 100,
    color: '#1D7801',
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 35,
    
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFFAF3',
    borderRadius: 10,
    padding: 25,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 5,
    borderColor: '#EFFAF3',
    shadowColor: 'rgba(0, 0, 0, 0.5)', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, 
    shadowRadius: 3.5,
  },
  cardContent: {
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
  },


});

export default SettingsScreen;





