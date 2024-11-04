import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { auth } from '../../../firebase'; // Adjust the path according to your firebase config
import { signOut } from 'firebase/auth';
import YesNoAlert from '../../../components/YesNoAlert'; // Adjust the import path as needed
import themeContext from '../../../components/ThemeContext';

const LecturerSettingsScreen = ({ navigation }) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const theme = useContext(themeContext)

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLecturerDashboard = () => {
    navigation.navigate('Lecturer Dashboard');
  };

  const handleLecturerProfile = () => {
    navigation.navigate('Lecturer Profile')
  }

  const handleLecturerNotification = () => {
    navigation.navigate('Lecturer Notification')
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate to Login screen or wherever you want after logout
      navigation.replace('Login Screen'); // Adjust the screen name according to your navigation setup
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.backgroundColor}]} contentContainerStyle={{ paddingBottom: 15 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name='arrow-back-outline' size={30} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lecturer Settings</Text>
      </View>

      {/* Profile Settings */}
      <TouchableOpacity style={styles.card} onPress={handleLecturerProfile}>
        <FontAwesome name="user-circle-o" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardSubtitle}>Update personal details and photo</Text>
        </View>
      </TouchableOpacity>

      {/* Notification Settings */}
      <TouchableOpacity style={styles.card} onPress={handleLecturerNotification}>
        <Ionicons name="notifications-outline" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardSubtitle}>Manage notification preferences</Text>
        </View>
      </TouchableOpacity>

      {/* Logout Option */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setShowLogoutAlert(true)}
      >
        <MaterialIcons name="logout" size={24} color="#006400" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Log Out</Text>
        </View>
      </TouchableOpacity>

      <YesNoAlert
        visible={showLogoutAlert}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onYes={handleLogout}
        onNo={() => setShowLogoutAlert(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  backArrow: {
    color: '#1D7801',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    marginLeft: 50, // Adjusted for better centering
    color: '#1D7801',
  },
  header: {
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

export default LecturerSettingsScreen;