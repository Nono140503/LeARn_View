import React, { useState } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function HomeBody({navigation}) {
    const [list, setList] = useState([
        {
            destination: 'AR Environment',
            description: 'Engage in interactive AR lessons and explore virtual scenarios for hands-on learning.',
            image: require('../assets/AR_image.jpeg'),
           
        },
        {
            destination: 'Practice Quizzes in the AR Environment',
            description: 'Test your knowledge with interactive AR quizzes and reinforce your learning.',
            image: require('../assets/bulb.jpg'),
        },
        {
            destination: 'Tests',
            description: 'Check and take your tests set as a quiz or in the AR environment.',
            image: require('../assets/online-test-checklist-pencil-computer-monitor-online-form-survey-online-questionnaire-choos_153097-2893.jpg'),
        },
        
    ]);


    return (
            <>
                <FlatList
                style={styles.list_cont}
                data={list}
                keyExtractor={(item) => item.destination}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            margin: 8,
                            padding: 5,
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        <ImageBackground
                            source={item.image}
                            style={styles.img}
                            imageStyle={{ borderRadius: 10}} 
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.destination}>{item.destination}</Text>
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
    container: {
        flex: 1,
        backgroundColor: 'white',
        maxHeight: 'auto',
    },
    description:{
        color: 'white',
        marginTop: 14,
        fontSize: 17,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',       
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 2,  
    },
    list_cont:{
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
    destination: {
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

export default HomeBody;
