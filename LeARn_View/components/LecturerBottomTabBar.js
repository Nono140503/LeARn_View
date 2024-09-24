import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


function LecturerBottomTabBar({ navigation, currentScreen }) {
    const defaultColor = 'grey';
    const activeColor = '#1D7801';

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home Screen')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='home' 
                    size={25} 
                    color={currentScreen === 'Home Screen' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Home Screen' ? activeColor : defaultColor }} >Home</Text>
            </TouchableOpacity>
           
            <TouchableOpacity
                onPress={() => navigation.navigate('Student Progress')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='people-outline'
                    size={25} 
                    color={currentScreen === 'Student Progress' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Student Progress' ? activeColor : defaultColor }}>Students</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Feedback & Communication')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='chatbubbles-outline' 
                    size={25} 
                    color={currentScreen === 'Feedback & Communication' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Feedback & Communication' ? activeColor : defaultColor }}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='cog-outline' 
                    size={27} 
                    color={currentScreen === 'Settings' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Settings' ? activeColor : defaultColor }}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopColor: 'grey',
        borderTopWidth: 0.4,
        padding: '2%',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
    
    },
    iconContainer: {
        padding: 10,
        alignItems: 'center',
    },
});

export default LecturerBottomTabBar;
