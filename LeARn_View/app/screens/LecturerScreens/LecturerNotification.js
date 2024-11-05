import { View, Text, StyleSheet, Button, SafeAreaView, Alert, Pressable, } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase'
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from '../../../components/ThemeContext';

const notificationSounds = [
    { label: 'Notification 1', path: 'NotificationSounds/notification1.wav' },
    { label: 'Notification 2', path: 'NotificationSounds/notification2.wav' },
    { label: 'Notification 3', path: 'NotificationSounds/notification3.wav' },
    { label: 'Notification 4', path: 'NotificationSounds/notification4.mp3' },
    { label: 'Notification 5', path: 'NotificationSounds/notification5.wav' },
    { label: 'Notification 6', path: 'NotificationSounds/notification6.wav' },
    { label: 'Notification 7', path: 'NotificationSounds/notification7.wav' },
];

export default function LecturerNotification() {

    const [selectedSound, setSelectedSound] = useState(notificationSounds[0].path);
    const [sound, setSound] = useState();
    const theme = useContext(themeContext)

    const user = auth.currentUser

    

    useEffect(() => {
        const getNotificationSound = async () => {
            const userId = user?.uid;
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const savedSoundPath = userDoc.data().notificationSound;
                
                if(savedSoundPath)
                {
                    setSelectedSound(savedSoundPath)
                }
                
            } 
        };

        getNotificationSound();

    }, []);

    const saveNotificationSound = async () => {
        const userId = user?.uid;

        if(userId && selectedSound)
        {
            const userRef = doc(db, 'users', userId);

            try{
                await updateDoc(userRef, { notificationSound: selectedSound }, { merge: true });
                Alert.alert("Successfully set new notification sound!");

                EventRegister.emit('NotificationSoundChanged')

            }catch(error){
                console.error('Error setting notification sound:', error)
                Alert.alert("Failed to set notification sound. Please try again")
            }
        }
        else
        {
            Alert.alert("User not logged in or sound not selected")
        }

    };

    const playSound = async () => {
        try {

            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
    
            
            const soundRef = ref(getStorage(), selectedSound);
            const soundURL = await getDownloadURL(soundRef);
    
           
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: soundURL });
            setSound(newSound);
            await newSound.playAsync();
            
        } catch (error) {
            console.error('Error playing sound:', error);
            Alert.alert('Failed to play sound. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <Text style={[styles.header, {color: theme.color}]}>Select Notification Sound</Text>
            <Picker
                selectedValue={selectedSound}
                onValueChange={(itemValue) => {
                    setSelectedSound(itemValue);
                    
                    if (sound) {
                        sound.stopAsync();
                    }
                }}
                style={[styles.picker, {backgroundColor: '#28a745', color: theme.color}]}
                dropdownIconColor={theme.color}
            >
                {notificationSounds.map((sound) => (
                    <Picker.Item label={sound.label} value={sound.path} key={sound.label}/>
                ))}
            </Picker>

            <Pressable>
                <TouchableOpacity onPress={playSound} style={styles.playBtn}>
                    <Text style={styles.playBtnText}>Play ▶</Text>
                </TouchableOpacity>
            </Pressable>

            <Pressable>
                <TouchableOpacity onPress={saveNotificationSound} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </Pressable>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 70,
        margin: 'auto',
    },

    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },

    playBtn:{
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 70,
        margin: 'auto',
        width: '80%',
        alignItems: 'center',
    },

    saveBtn:{
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 20,
        margin: 'auto',
        width: '80%',
        alignItems: 'center',
    },

    playBtnText:{
        color: '#FFFFFF',
    },

    saveBtnText:{
        color: "#FFFFFF",
    },
});