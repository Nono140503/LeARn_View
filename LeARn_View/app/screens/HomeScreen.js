import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import BottomTabBar from '../../components/BottomTabBar';
import HomeBody from '../../components/HomeBody';
import HomeHeader from '../../components/HomeHeader';

function HomeScreen({navigation}){

    const [currentScreen, setCurrentScreen] = useState('Home Screen');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    return (
        <>
        <View style={styles.container}>
            <HomeHeader/>
            <Text style={styles.heading}>Systems Software</Text>
            <HomeBody navigation={navigation}/>
            <BottomTabBar 
             navigation={navigation} 
             currentScreen={currentScreen}
             onNavigate={handleNavigation}/>
        </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    heading:{
        marginTop: 10,
        marginLeft: 10,
        color: '#1D7801',
        fontWeight: 'bold',
        fontSize: 18,
    },
    
})
export default HomeScreen