import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../../../components/BottomTabBar';

const GradesScreen = ({navigation}) => {
  // Sample user and quiz data
  const [currentScreen, setCurrentScreen] = useState('Grades Screen');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };
  const user = {
    name: 'Layla Smith',
    studentNumber: '2242457',
    year: 'First Year',
    course: 'BIT',
    avatar: '../../../assets/Layla.jpeg', 
  };

  const quizzes = [
    {
      title: 'Troubleshooting Quiz',
      date: '16 September 2024 @ 16:23pm',
      mark: '10/10',
      percentage: '100%',
      color: '#00cc00', 
    },
    {
      title: 'Computer Components Quiz',
      date: '03 October 2024 @ 08:47pm',
      mark: '18/50',
      percentage: '36%',
      color: '#ff6666', // Red for low scores
    },
  ];

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="black" />
        <Text style={styles.title}>Grades</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.userDetail}>Name: {user.name}</Text>
          <Text style={styles.userDetail}>Student number: {user.studentNumber}</Text>
          <Text style={styles.userDetail}>Year: {user.year}</Text>
          <Text style={styles.userDetail}>Course: {user.course}</Text>
        </View>
      </View>

      {/* Quiz Grades */}
      <View style={styles.quizzes}>
        {quizzes.map((quiz, index) => (
          <View key={index} style={styles.quizCard}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDate}>Date Attempted: {quiz.date}</Text>
            <Text style={[styles.quizMark, { backgroundColor: quiz.color }]}>
              Mark: {quiz.mark} ({quiz.percentage})
            </Text>
          </View>
        ))}
      </View>

        
    </ScrollView>
    <BottomTabBar
    navigation={navigation} 
    currentScreen={currentScreen}
    onNavigate={handleNavigation}/>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  userInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetail: {
    fontSize: 16,
  },
  quizzes: {
    margin: 16,
  },
  quizCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quizDate: {
    fontSize: 14,
    marginBottom: 8,
    color: 'gray',
  },
  quizMark: {
    fontSize: 16,
    color: 'white',
    padding: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    elevation: 5,
  },
});

export default GradesScreen;
