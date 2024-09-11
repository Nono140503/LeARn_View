import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Button, ScrollView, SafeAreaView, Alert, Switch } from 'react-native'
import React, { useEffect, useState, createContext, useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function Profile() {

    const [isEnabled, setIsEnabled] = useState(false)
    const toggleSwitch = () => setIsEnabled(isEnabled => !isEnabled)

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>

                {/* Profile Picture */}
                <View style={styles.profilePic}>
                    <Image source={''} style={styles.pfp}></Image>
                    <Text style={styles.userNameDisplay}>Username</Text>
                </View>


                {/* Username Input */}
                <View style={styles.textInput}>
                    <TextInput placeholder='Username' style={styles.textInputText}></TextInput>
                </View>


                {/* Email Input */}
                <View style={styles.textInput}>
                    <TextInput placeholder='Email' style={styles.textInputText}></TextInput>
                </View>


                {/* Phone Number Input */}
                <View style={styles.textInput}>
                    <TextInput placeholder='Phone Number' style={styles.textInputText}></TextInput>
                </View>


                {/* Light/Dark Mode Switch */}
                <View style={styles.lightDarkMode}>
                    <Switch
                        trackColor={{ false: "#1D7801", true: "#c5c9c3" }}
                        thumbColor={isEnabled ? "#1D7801" : "#c5c9c3"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                    />

                    <Text style={styles.lightDarkText}>Light/Dark Mode</Text>
                </View>


                {/* Save Changes Button */}
                <View style={styles.saveChangesButton}>

                    <Pressable>

                        {/* Gradient for Button */}
                        <LinearGradient
                            colors={["#1D7801", "#36DE02"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >

                            <TouchableOpacity style={styles.saveBTN}>
                                <Text style={styles.saveBtnText}>Save Changes</Text>
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
    },

    profilePic: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 70,
    },

    pfp: {
        width: 150,
        height: 150,

        borderRadius: 70,

        margin: 'auto',
        alignSelf: 'center'
    },

    userNameDisplay: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
    },

    textInput: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#1D7801",

        width: 300,
        height: 50,
        padding: 3,

        margin: 'auto',
        flexDirection: 'column',
        marginVertical: 5,
    },

    textInputText: {
        fontSize: 18,
        textAlign: "left",
        padding: 5,
    },

    lightDarkMode: {
        marginLeft: 40,
        marginRight: 'auto',
        marginVertical: 20,
        flexDirection: 'row',
    },

    lightDarkText: {
        marginLeft: 10,
        marginTop: 15,
    },

    saveChangesButton: {
        margin: 'auto',
    },

    saveBTN: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "transparent",
        backgroundColor: "transparent",

        width: 150,
        height: 50,
        padding: 5,

        justifyContent: 'center',
    },

    saveBtnText: {
        textAlign: 'center',
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },

    gradient: {
        borderRadius: 7,
        padding: 5,
    },
})

