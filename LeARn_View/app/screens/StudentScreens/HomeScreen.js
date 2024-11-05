import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, BackHandler} from 'react-native'
import { EventRegister } from 'react-native-event-listeners';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { auth, db } from '../../../firebase'
import { doc, setDoc, getDoc, onSnapshot, collection } from 'firebase/firestore'
import { Audio } from 'expo-av';
import BottomTabBar from '../../../components/BottomTabBar';
import HomeBody from '../../../components/HomeBody';
import HomeHeader from '../../../components/HomeHeader';
import themeContext from '../../../components/ThemeContext';


function HomeScreen({navigation}){

    const theme = useContext(themeContext);
    const [currentScreen, setCurrentScreen] = useState('Home Screen');
    const [notificationSound, setNotificationSound] = useState(null)
    const [sound, setSound] = useState()  

    const user = auth.currentUser

    // Fetch and set notification sound
    const fetchAndSetNotificationSound = async () => {
        if(!user) return;
            
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
    
        if(userDoc.exists())
        {
            const soundFileName = userDoc.data().notificationSound;
    
            if(soundFileName)
            {
                const storage = getStorage();
                const storageRef = ref(storage, soundFileName);
    
                try{
                    const downloadURL = await getDownloadURL(storageRef);
                    setNotificationSound(downloadURL)
                    console.log("Fetched sound:", downloadURL)
                }catch(error)
                {
                    console.error("Error fetching download URL", error)
                }
            }
    
        }
    }


     // Play Notification Sound
    const playSound = async () => {
        if(notificationSound)
        {

            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync({uri: notificationSound})
            setSound(sound)
            await sound.playAsync()
        }
    }

    // Fetch notification sounds on initial load
    useEffect(() => {
        fetchAndSetNotificationSound();
    }, []);

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

    // Listen for new Announcements
    useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
        const newAnnouncements = snapshot.docChanges().filter(change => change.type === 'added');

            if (newAnnouncements.length > 0) {
                // Check if notificationSound is set
                if (notificationSound) {
                    playSound();
                } else {
                    console.log("No notification sound URL available.");
                }
            }
        });

        return () => unsubscribe();
    }, [notificationSound]);

    // Reload new notification sound after updating in Notification Settings
    useEffect(() => {

        const notificationSoundListener = EventRegister.addEventListener('NotificationSoundChanged',  () => {
           
            fetchAndSetNotificationSound();
            playSound();
        })
  
        return () => {
            EventRegister.removeEventListener(notificationSoundListener)
      }
    }, [])

    // Prevent user from navigating to Login with device back button
    // useEffect(() => {
    //     const backAction = () => {
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, []);

    // Navigation handler
    const handleNavigation = (screen) => {
        setCurrentScreen(screen);
        navigation.navigate(screen);
    };

    return (
        <>
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
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
        marginTop: 15,
        marginRight: 150,
        color: '#1D7801',
        fontWeight: 'bold',
        fontSize: 20,
    },
    
})
export default HomeScreen