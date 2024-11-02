import React, {useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { doc, getDoc, collection, } from 'firebase/firestore'
import BottomTabBar from '../../../components/BottomTabBar';
import themeContext from '../../../components/ThemeContext';


const GradesScreen = ({navigation}) => {
  // Sample user and quiz data
  const [currentScreen, setCurrentScreen] = useState('Grades Screen');
  const [image, setImage] = useState('')
  const [username, setUsername] = useState('')
  const [year, setYear] = useState('')
  const [course, setCourse] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  // const [tests, setTests] = useState([]);
  const theme = useContext(themeContext);

  const user = auth.currentUser

    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    // Fetch User data
    useEffect(() => {
      const fetchStudentProfile = async() => {
        const userRef = doc(db, 'students', user.uid)
        const userDoc = await getDoc(userRef)

        if(userDoc.exists())
        {
          const userData = userDoc.data()
          setUsername(userData.username)
          setYear(userData.year)
          setStudentNumber(userData.studentNumber)
          setCourse(userData.course)
        }

        const userPFP = doc(db, 'users', user.uid)
        const userPFP_Doc = await getDoc(userPFP)

        if(userPFP_Doc.exists())
        {
          const userPFP_Data = userPFP_Doc.data()
          setImage(userPFP_Data.profileImage)
        }
      }

      // Fetch Test data
      // const fetchTestData = async() => {
      //   const testCollectionRef = collection(db, 'tests', user.uid)
      //   const testDocs = await getDoc(testCollectionRef)
      //   const testArray = testDocs.doc.map(doc => ({id: doc.id, ...doc.data()}))
      //   setTests(testArray)
      // }


      fetchStudentProfile()
      // fetchTestData()
    }, [])

    

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
    <ScrollView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="black" />
        <Text style={styles.title}>Grades</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={image ? { uri: image } : null} style={styles.avatar} />
        <View>
          <Text style={styles.userDetail}>Name: {username}</Text>
          <Text style={styles.userDetail}>Student number: {studentNumber}</Text>
          <Text style={styles.userDetail}>Year: {year}</Text>
          <Text style={styles.userDetail}>Course: {course}</Text>
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

      {/* Test Grades */}
      {/* <View style={styles.tests}>
          {tests.map((test, index) => (
            test.attempts === 0 ? ( // Check if attempts are 0
              <View key={index} style={styles.testCard}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testDate}>Date Attempted: {test.date}</Text>
                <Text style={[styles.testMark, { backgroundColor: test.color }]}>
                  Mark: {test.mark} ({test.percentage})
                </Text>
              </View>
            ) : null // Do not display anything if attempts are not 0
          ))}
        </View> */}
        
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
    backgroundColor: '#4CAF50',
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    marginTop: 10,
  },
  userDetail: {
    fontSize: 16,
    color: 'white',
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
  tests: {
    margin: 16,
  },
  testCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testDate: {
    fontSize: 14,
    marginBottom: 8,
    color: 'gray',
  },
  testMark: {
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
