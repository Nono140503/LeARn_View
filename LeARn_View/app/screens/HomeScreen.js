import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import BottomTabBar from '../../components/BottomTabBar';
import HomeBody from '../../components/HomeBody';
// import TouristAttractionHeader from '../../components/TouristAttractionHeader';


function HomeScreen({navigation}){

    const [currentScreen, setCurrentScreen] = useState('Home Screen');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    return (
        <>
        <View style={styles.container}>
        {/* <TouristAttractionHeader navigation={navigation}/> */}
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
    
})
export default HomeScreen