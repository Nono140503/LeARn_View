import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Profile from '../app/screens/ProfileScreen';
import LeaderBoard from '../app/screens/LeaderBoardScreen';

function BottomTabBar({ navigation, currentScreen }) {
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
                onPress={() => navigation.navigate('Grades')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='school-outline' 
                    size={25} 
                    color={currentScreen === 'Grades' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Cart' ? activeColor : defaultColor }}>Grades</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Games')}
                style={styles.iconContainer}
            >
                <Icon 
                    name='game-controller-outline' 
                    size={25} 
                    color={currentScreen === 'Games' ? activeColor : defaultColor} 
                />
                <Text style={{ color: currentScreen === 'Games' ? activeColor : defaultColor }}>Games</Text>
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

export default BottomTabBar;
