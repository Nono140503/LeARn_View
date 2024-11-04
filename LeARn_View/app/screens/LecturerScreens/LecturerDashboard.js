import React, { useState, useContext, useEffect } from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { doc, setDoc, getDoc, onSnapshot, collection } from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import { EventRegister } from 'react-native-event-listeners';
import LecturerHome from '../../../components/LecturerHome';
import LecturerHeader from '../../../components/LecturerHeader';
import LecturerBottomTabBar from '../../../components/LecturerBottomTabBar';
import themeContext from '../../../components/ThemeContext';

function LecturerDashboard({navigation}){

    const [currentScreen, setCurrentScreen] = useState('Home Screen');
    const theme = useContext(themeContext)

    const user = auth.currentUser

    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    // Fetch Dark mode
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            if(userDoc.exists())
            {
                const userData = userDoc.data()
                EventRegister.emit('ChangeTheme', userData.darkMode)
            }
        }

        fetchUserProfile()
    }, [])

    return (
        <>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
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