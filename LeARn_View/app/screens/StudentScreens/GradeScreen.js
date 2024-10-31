import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for the icons at the bottom

const GradesScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={30} color="#4CAF50" />
        <Text style={styles.headerTitle}>Grades</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../../assets/Layla.jpeg')} // Using require for the avatar
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Name: Layla Smith</Text>
          <Text>Student number: 2242457</Text>
          <Text>Year: First Year</Text>
          <Text>Course: BIT</Text>
        </View>
      </View>

      {/* Quiz Results Section */}
      <ScrollView style={styles.quizSection}>
        <View style={styles.quizCard}>
          <Text style={styles.quizTitle}>Troubleshooting Quiz</Text>
          <Text style={styles.quizDate}>Date Attempted: 16 September 2024 @ 16:23pm</Text>
          <Text style={styles.quizMarkGreen}>Mark: 10/10 (100%)</Text>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizTitle}>Computer Components Quiz</Text>
          <Text style={styles.quizDate}>Date Attempted: 03 October 2024 @ 08:47pm</Text>
          <Text style={styles.quizMarkRed}>Mark: 18/50 (36%)</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={24} color="gray" />
        <Ionicons name="stats-chart-outline" size={24} color="green" />
        <Ionicons name="game-controller-outline" size={24} color="gray" />
        <Ionicons name="settings-outline" size={24} color="gray" />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop:30
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    color: '#4CAF50',
    fontSize: 25,
    marginLeft: 10,
    alignItems: 'center',
    fontWeight: 'bold'
  },
  profileSection: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  quizSection: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  quizCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizDate: {
    marginVertical: 5,
    fontSize: 14,
    color: '#777',
  },
  quizMarkGreen: {
    fontSize: 16,
    color: '#4CAF50', // Green color for high score
  },
  quizMarkRed: {
    fontSize: 16,
    color: '#F44336', // Red color for low score
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default GradesScreen;