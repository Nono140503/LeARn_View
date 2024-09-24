import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import LecturerHome from '../../../components/LecturerHome';
import LecturerHeader from '../../../components/LecturerHeader';
import LecturerBottomTabBar from '../../../components/LecturerBottomTabBar';

function LecturerDashboard({navigation}){

    const [currentScreen, setCurrentScreen] = useState('Home Screen');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    return (
        <>
        <View style={styles.container}>
            <LecturerHeader/>

            <LecturerHome navigation={navigation}/>
            <LecturerBottomTabBar 
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
        marginTop: 15,
        marginRight: 150,
        color: '#1D7801',
        fontWeight: 'bold',
        fontSize: 20,
    },
    
})
export default LecturerDashboard