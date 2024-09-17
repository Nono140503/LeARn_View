//Settings Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

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

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1D7801',
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





