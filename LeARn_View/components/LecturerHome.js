import React, { useState } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

function LecturerHome({ navigation }) {
    const [list, setList] = useState([
        {
            title: 'Class Performance',
            description: 'View and analyze student performance across quizzes, tests, and AR lessons',
            image: require('../assets/Performance.jpeg'),
            navigation: 'Class Performance',  
        },
        {
            title: 'Create a quiz',
            description: 'Test your knowledge with interactive AR quizzes and reinforce your learning.Create, schedule, and manage quizzes with customized settings.',
            image: require('../assets/images (1).png'),
            navigation: 'Lecturer Dashboard',  
        },
        {
            title: 'Create a Test',
            description: 'Set up tests with random questions and monitor progress in real-time.',
            image: require('../assets/test.jpg'),
            navigation: 'AR Environment Screen', 
        },
        {
            title: 'AR Lesson Management',
            description: 'Assign and customize AR lessons for individuals or groups.',
            image: require('../assets/AR_Management.jpg'),
            navigation: 'AR Environment Screen', 
        },
    ]);

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
                            style={styles.img}
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
});

export default LecturerHome;
