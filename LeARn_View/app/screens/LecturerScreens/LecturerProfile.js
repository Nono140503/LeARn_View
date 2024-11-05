import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Button, ScrollView, SafeAreaView, Alert, Switch, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, createContext, useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import { EventRegister } from 'react-native-event-listeners'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import { Audio } from 'expo-av'
import themeContext from '../../../components/ThemeContext'

export default function LecturerProfile( { navigation } ) {

    const [image, setImage] = useState('')
    const theme = useContext(themeContext)
    const [darkMode, setDarkMode] = useState(false)
    const [notificationSound, setNotificationSound] = useState(null)
    const [displayUserName, setDisplayUserName] = useState('')
    const [usernameChange, setUsername] = useState('')
    const [loading, setLoading] = useState(false); 


    const user = auth.currentUser

    // Fetch User Data from Firestore    
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            if(userDoc.exists())
            {
                const userData = userDoc.data()
                setImage(userData.profileImage || '')
                setDarkMode(userData.darkMode || false)
                setDisplayUserName(userData.username)
                EventRegister.emit('ChangeTheme', userData.darkMode || false)
            }
        }

        fetchUserProfile()
    }, [])

    
    
    // Image Picker
    const handleImagePicker = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        })

        if(!result.canceled)
        {
            const selectedImageURI = result.assets[0].uri
            setImage(selectedImageURI)

            const response = await fetch(selectedImageURI)
            const blob = await response.blob()
            const storage = getStorage()
            const storageRef = ref(storage, `Profile_Images/${Date.now()}`)

            uploadBytes(storageRef, blob).then(async (snapshot) => {
                console.log('Uploaded a blob or file', snapshot)

                const downloadURL = await getDownloadURL(storageRef)
                console.log('File available at', downloadURL)

                await updateDoc(doc(db, 'users', user.uid), {
                    profileImage: downloadURL,
                    darkMode: darkMode,
                })
            }).catch((error) => {
                console.error('Upload failed', error)
            })

        }
    }

    // Save changes made to profile
    const saveChanges = async () => {
        setLoading(true)

        if(usernameChange.length > 0)
        {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                darkMode: darkMode,
                profileImage: image,
                username: usernameChange,
            })
            Alert.alert("Changes Saved!")
            setLoading(false)
        }
        else{
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                darkMode: darkMode,
                profileImage: image,
            })
            Alert.alert('Changes Saved!')
            setLoading(false)
        }
        
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>

               {/* Profile Picture */}
               <Pressable>
                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                        <View style={[styles.profilePic, {borderColor: theme.borderColor}]}>

                            {image && <Image source={ { uri: image } } style={styles.pfp}/>}

                        </View>
                    </TouchableOpacity>
                </Pressable>
                

                {/* Username display */}
                <View style={styles.username}>
                    <Text style={[styles.userNameDisplay, {color: theme.color}]}>{displayUserName}</Text>
                </View>


                {/* Username Input */}
                <View style={styles.textInput}>
                    <TextInput placeholder='Username' placeholderTextColor= {theme.placeholderTextColor} style={[styles.textInputText, {color: theme.color}]} onChangeText={(text) => setUsername(text)} value={usernameChange}></TextInput>
                </View>



                {/* Light/Dark Mode Switch */}
                <View style={styles.lightDarkMode}>
                    <Switch
                        trackColor={{ false: "#1D7801", true: "#c5c9c3" }}
                        thumbColor={darkMode ? "#1D7801" : "#c5c9c3"}
                        value={darkMode}
                        onValueChange={(value) => {
                            setDarkMode(value)
                            EventRegister.emit('ChangeTheme', value)
                        }}
                        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                    />

                    <Text style={[styles.lightDarkText, {color: theme.color}]}>Light/Dark Mode</Text>
                </View>


                {/* Save Changes Button */}
                <View style={styles.notificationsButton}>

                    <Pressable>

                        {/* Gradient for Button */}
                        <LinearGradient
                            colors={["#1D7801", "#36DE02"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >

                            <TouchableOpacity style={styles.saveBTN} onPress={saveChanges} disabled={loading}>

                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ): (
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            )}

                            </TouchableOpacity>

                        </LinearGradient>

                    </Pressable>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
        padding: 20, 
    },

    profilePic: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 70,
        borderWidth: 2,
        borderRadius: 100,
        width: 150,
        height: 150,
        margin: 'auto',
        alignSelf: 'center',
        overflow: 'hidden',
    },

    pfp: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },

    username: {
        marginTop: 40,
        marginBottom: 30,
    },

    userNameDisplay: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },

    textInput: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#1D7801",
        width: '100%', 
        maxWidth: 300, 
        height: 50,
        padding: 3,
        marginVertical: 10, 
    },

    textInputText: {
        fontSize: 18,
        textAlign: "left",
        padding: 5,
    },

    lightDarkMode: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center', 
        marginLeft: 10,
    },

    lightDarkText: {
        marginLeft: 10,
        fontSize: 16, 
    },

    notificationsButton: {
        marginVertical: 10, 
        alignItems: 'center', 
    },

    saveBTN: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "transparent",
        backgroundColor: "transparent",
        width: 150, 
        maxWidth: 300, 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },

    saveBtnText: {
        textAlign: 'center',
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },

    gradient: {
        borderRadius: 7,
        padding: 0, 
        width: '100%', 
        maxWidth: 300, 
    },

    notiBTN: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "transparent",
        backgroundColor: "transparent",
        width: '100%', 
        maxWidth: 300, 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },

    notiText: {
        textAlign: 'center',
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },
});

