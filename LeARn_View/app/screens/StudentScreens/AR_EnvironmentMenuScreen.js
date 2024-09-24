import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ARMenu from '../../../components/AR_Menu';
import BottomTabBar from '../../../components/BottomTabBar';

function AR_EnvironmentMenuScreen({navigation}){
    const [currentScreen, setCurrentScreen] = useState('AR Environment Menu');
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };
    return(
        <>
        <View>
            <View style={styles.header}>
                <Text style={styles.headerText}>AR Environment</Text>
            </View>
            <ARMenu navigation={navigation}/>
        </View>
        <BottomTabBar
        navigation={navigation} 
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
        />
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    header:{
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    headerText:{
        fontSize: 20,
        color: '#1D7801',
        fontWeight: 'bold'
    }

})
export default AR_EnvironmentMenuScreen