import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LecturerBottomTabBar from '../../../components/LecturerBottomTabBar';

const students = [
    { 
        id: '1', 
        name: 'Layla', 
        surname: 'Smith', 
        student_number: '2242457',
        year: 'First Year',
        course: "BIT", 
        lastActive: '5 mins ago', 
        image: require('../../../assets/Layla.jpeg'),
        progress: [0.63, 0.6, 0.67], 
        performanceHistory: [78, 82, 64, 80], 
        engagementLevel: [{ name: 'Quizzes', population: 40 }, { name: 'AR Lessons', population: 30 }, { name: 'Practical Sessions', population: 20 }, { name: 'Idle/Non Engagement', population: 10 }], // Engagement level
        gradeOverview: [79, 81, 87,],
    },
    { 
        id: '2', 
        name: 'Lerato', 
        surname: 'Malatjie', 
        student_number: '2242458', 
        year: 'First Year',
        course: "BIT",  
        lastActive: '1 hour ago', 
        image: require('../../../assets/Lerato.jpeg'),
        progress: [0.5, 0.4, 0.62], 
        performanceHistory: [60, 45, 70, 85],
        engagementLevel: [{ name: 'Quizzes', population: 30 }, { name: 'AR Lessons', population: 40 }, { name: 'Practical Sessions', population: 15 }, { name: 'Idle/Non Engagement', population: 15 }],
        gradeOverview: [64, 71, 60, ],
    },
    { 
        id: '3', 
        name: 'James', 
        surname: 'Doe', 
        student_number: '2242459', 
        year: 'First Year',
        course: "BIT", 
        lastActive: '11 mins ago',  
        image: require('../../../assets/James Doe.jpeg'),
        progress: [0.45, 0.6, 0.33], 
        performanceHistory: [40, 65, 73, 60],
        engagementLevel: [{ name: 'Quizzes', population: 20 }, { name: 'AR Lessons', population: 25 }, { name: 'Practical Sessions', population: 30 }, { name: 'Idle/Non Engagement', population: 25 }],
        gradeOverview: [44, 61, 55,],
    },
    { 
        id: '4', 
        name: 'Thuto', 
        surname: 'Modise', 
        student_number: '2242460', 
        year: 'First Year',
        course: "BIT", 
        lastActive: '7 mins ago', 
        image: require('../../../assets/avatar-removebg-preview.png'),
        progress: [0.55, 0.5, 0.67], 
        performanceHistory: [40, 55, 30, 65],
        engagementLevel: [{ name: 'Quizzes', population: 40 }, { name: 'AR Lessons', population: 30 }, { name: 'Practical Sessions', population: 20 }, { name: 'Idle/Non Engagement', population: 10 }],
        gradeOverview: [54, 69, 64,]
    },
];

const StudentProgress = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState(''); 


    const filteredStudents = students.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [currentScreen, setCurrentScreen] = useState('Student Progress');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    const renderItem = ({ item }) => (
        <View style={styles.studentContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{`${item.name} ${item.surname}`}</Text>
                <Text style={styles.studentYear}>{item.year} {item.course}</Text>
                <Text style={styles.studentLastActive}>Last Active: {item.lastActive}</Text>
            </View>
            <Icon 
                name="chevron-forward-outline" 
                size={25} 
                color={'green'}
                onPress={() => navigation.navigate('Progress', { student: item })} 
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="arrow-back-outline" size={30} style={styles.icon} onPress={() => navigation.goBack()} />
                <Text style={styles.headerText}>Student Progress</Text>
            </View>
            <Text style={styles.studentHead}>Students</Text>
            <Text style={styles.total}>Total number of students: 144</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for a student"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />
            <FlatList
                data={filteredStudents} 
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        <LecturerBottomTabBar
        navigation={navigation} 
        currentScreen={currentScreen}
        onNavigate={handleNavigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    studentHead:{
        marginLeft: 15,
        fontSize: 18,
        color: '#3C7BF2',
        fontWeight: 'bold'
    },
    total:{
        marginLeft: 15,
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 30,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 55,
        color: '#227d39',
    },
    icon: {
        color: "#227d39",
    },
    listContainer: {
        padding: 10,
    },
    studentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EFFAF3',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8, 
        shadowRadius: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    studentYear: {
        fontSize: 15,
        color: '#3D8DCB',
    },
    studentLastActive: {
        fontSize: 12,
        color: 'gray',
    },
    searchInput: {
        height: 40,
        borderColor: '#227d39',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        width: '90%',
        marginLeft: 15,
    },
});

export default StudentProgress;
