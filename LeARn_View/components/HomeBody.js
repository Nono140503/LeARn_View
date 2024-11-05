import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Button, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  BackHandler 
} from 'react-native';
import { db } from '../firebase'; 
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'; 
import { Picker } from '@react-native-picker/picker'; 
import YesNoAlert from './YesNoAlert'; 

function HomeBody({ navigation }) {
  const [list, setList] = useState([
    {
        title: 'AR Environment',
        description: 'Engage in interactive AR lessons and explore virtual scenarios for hands-on learning.',
        image: require('../assets/AR_image.jpeg'),
        navigation: 'AR Environment Screen',  
    },
    {
        title: 'Practice Quizzes in the AR Environment',
        description: 'Test your knowledge with quizzes and reinforce your learning.',
        image: require('../assets/bulb.jpg'),
        navigation: 'Quiz List',  
    },
    {
        title: 'Tests',
        description: 'Check and take your tests set as a quiz.',
        image: require('../assets/online-test-checklist-pencil-computer-monitor-online-form-survey-online-questionnaire-choos_153097-2893.jpg'),
        navigation: 'Test List', 
    },
]);

  const [modalVisible, setModalVisible] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState({
      name: '',
      surname: '',
      student_number: '',
      year: '',
      course: ''
  });
  const [loading, setLoading] = useState(false); 
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'students'));
            if (querySnapshot.empty) {
                setModalVisible(true); 
            } else {
                const firstDoc = querySnapshot.docs[0];
                setStudentId(firstDoc.id);
                setStudentData(firstDoc.data());
            }
        } catch (error) {
            console.error("Error checking user data: ", error);
        }
    };
    
    checkUserData();

    const backAction = () => {
        setShowAlert(true); 
        return true; 
    };

    // Add listener when focusing on the screen
    const unsubscribe = navigation.addListener('focus', () => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
    });

    // Remove listener only when NOT focused on this screen
    const unsubscribeFromBackHandler = navigation.addListener('blur', () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    });

    return () => {
        unsubscribe(); 
        unsubscribeFromBackHandler();
    };
}, [navigation]);

  const handleLogout = () => {
      navigation.navigate('Login Screen'); 
  };
    const handleSave = async () => {
        const { name, surname, student_number, year, course } = studentData;

        if (name && surname && student_number && year && course) {
            const currentStudentId = studentId || doc(collection(db, 'students')).id;

            setLoading(true); 
            try {
                const studentRef = doc(db, 'students', currentStudentId); 
                await setDoc(studentRef, {
                    name,
                    surname,
                    student_number,
                    year,
                    course,
                    infoCollected: true
                });

                setModalVisible(false); 
                Alert.alert('Info Saved', 'Your information has been saved successfully.');
            } catch (error) {
                console.error("Error saving student data: ", error);
                Alert.alert('Error', 'There was an error saving your information.');
            } finally {
                setLoading(false); 
            }
        } else {
            Alert.alert('Error', 'Please fill in all the fields.');
        }
    };

    return (
        <>
            <FlatList
                style={styles.listCont}
                data={list}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            if (item?.navigation) {
                                navigation.navigate(item.navigation);
                            } else {
                                console.warn('Invalid navigation route');
                            }
                        }}
                    >
                        <ImageBackground
                            source={item.image}
                            style={ styles.img}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 15 }}
            />
            <View style={styles.space}>
                <Text></Text>
            </View>
            <YesNoAlert
                visible={showAlert}
                title="Log Out"
                message="Are you sure you want to log out?"
                onYes={handleLogout}
                onNo={() => setShowAlert(false)} 
            />
            {/* Modal for first-time student information collection */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent }>
                        <Text style={styles.modalTitle}>Welcome! Please provide your details:</Text>

                        <TextInput
                            placeholder="Name"
                            style={ styles.input}
                            value={studentData.name}
                            onChangeText={(text) => setStudentData({ ...studentData, name: text })}
                        />
                        <TextInput
                            placeholder="Surname"
                            style={styles.input}
                            value={studentData.surname}
                            onChangeText={(text) => setStudentData({ ...studentData, surname: text })}
                        />
                        <TextInput
                            placeholder="Student Number"
                            style={styles.input}
                            value={studentData.student_number}
                            onChangeText={(text) => setStudentData({ ...studentData, student_number: text })}
                        />

                        {/* Year Dropdown */}
                        <Text style={styles.label}>Year:</Text>
                        <Picker
                            selectedValue={studentData.year}
                            style={styles.picker}
                            onValueChange={(itemValue) => setStudentData({ ...studentData, year: itemValue })}
                        >
                            <Picker.Item label="Select Year" value="" />
                            <Picker.Item label="1st Year" value="1st Year" />
                            <Picker.Item label="2nd Year" value="2nd Year" />
                            <Picker.Item label="3rd Year" value="3rd Year" />
                        </Picker>

                        {/* Course Dropdown */}
                        <Text style={styles.label}>Course:</Text>
                        <Picker
                            selectedValue={studentData.course}
                            style={styles.picker}
                            onValueChange={(itemValue) => setStudentData({ ...studentData, course: itemValue })}
                        >
                            <Picker.Item label="Select Course" value="" />
                            <Picker.Item label="Business Information Technology" value="Business Information Technology" />
                            <Picker.Item label="Computer Science" value="Computer Science" />
                            <Picker.Item label="Information Systems" value="Information Systems" />
                        </Picker>

                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <Button title="Save" onPress={handleSave} />
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        margin: 8,
        padding: 5,
        gap: 10,
        alignItems: "center",
    },
    description: {
        color: 'white',
        marginTop: 14,
        fontSize: 17,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    listCont: {
        marginTop: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 10,
        padding: 15,
    },
    img: {
        width: '100%',
        height: 175,
        borderRadius: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        marginTop: '5%',
    },
    space: {
        height: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
    },
    input : {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
});

export default HomeBody;