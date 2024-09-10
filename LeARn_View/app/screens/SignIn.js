import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Button, ScrollView, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useState, createContext, useContext } from 'react'
// import LinearGradient from 'react-native-linear-gradient'
import  Icon  from 'react-native-vector-icons/Ionicons'

export default function SignIn() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [valid, setValid] = useState(false)

    const userName = "Moodles"
    const pswd = "Pas$word1"

    useEffect(() => {
        validateForm()
    }, [username, password])

    const validateForm = () => {
        const errors = {}
        

        if (!username) { errors.username = "Username Empty" }
        else if (username !== userName) { errors.username = "Incorrect Username" }
        
        if (!password) { errors.password = "Password Empty" }
        else if (password !== pswd) { errors.password = "Incorrect Password" }
        else if (password.length < 8) { errors.password = "Password must be a minimum of 8 characters"}
        
        setErrors(errors)
        setValid(Object.keys(errors).length === 0)
    }

    const handleSignIn = () => {
        if(valid)
        {
            setUsername(username)
            setPassword(password)
            Alert.alert(`Welcome ${username}, ${password}`)
        }
        else{
            Alert.alert(`Invalid`)
        }
    }

    const GradientBackGround = () => {
        return(

            <Pressable style={styles.pressable}>

                    {/* <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style = {styles.gradientBackground}
                    > */}
                    
                        <TouchableOpacity style={styles.signInBtn} activeOpacity={0.7} onPress={handleSignIn}>
                                <Text style={styles.signInBtnText}>Log In</Text>
                        </TouchableOpacity>
                    {/* </LinearGradient> */}
                    
            </Pressable>
        )
    }



  return (
    <SafeAreaView style={styles.container}>

        <ScrollView>

            <View style={styles.welcomeContainer}>
                <Text style={styles.welcome}>Welcome Back!</Text>
            </View>



            <View style={styles.signInCard}>

                <View style={styles.emailContainer}>
                    <TextInput style={styles.input} placeholder='Email...' value={username} onChangeText={setUsername}></TextInput>
                </View>

                <View style={styles.userPasswordContainer}>
                    <TextInput style={styles.input} placeholder='Password...' value={password} onChangeText={setPassword} secureTextEntry></TextInput>
                </View>

                <View style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </View>

                {/* Log In Button Below This */}
                <GradientBackGround/>

                <View style={styles.ORContainer}>
                    <Text style={styles.OR}>
                        OR
                    </Text>
                </View>

                <View style={styles.signUpLink}>
                    <Pressable>
                        <Text style={styles.signUpLinkText}>Sign Up</Text>
                    </Pressable>

                    <Text style={styles.signUpLinkTextRest}>to join LeARn_View</Text>
                </View>

                

                <View style={styles.socialMediaContainer}>
                    <Icon name='logo-facebook' size={20} style={styles.facebook}/>
                    <Icon name='logo-instagram' size={20} style={styles.instagram}/>
                    <Icon name='logo-twitter' size={20} style={styles.twitter}/>

                </View>

            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    emailContainer:{
        flex: 1,
        marginLeft: 5,
        marginTop: -90,
        alignItems: "flex-start"
    },

    userPasswordContainer:{
        flex: 1,
        marginTop: -10,
        marginLeft: 5,
        alignItems: "flex-start"
    },

    forgotPasswordContainer:{
        flex: 1,
    },

    signInCard:{
        // borderWidth: 1,
        // borderRadius: 20,
        width: 300,
        height: 350,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: -90,
        marginBottom: 50,
    },

    signUpText:{
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "left",
        marginLeft: 15,
        textDecorationLine: "underline",
    },

    signInText:{
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "right",
        marginRight: 15,
        textDecorationLine: "underline",
        marginTop: -80,
    },

    userText:{
        textAlign: "left",
        color: "white",
        fontSize: 16,
        marginLeft: 20,
        marginTop: 5,
    },

    input:{
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#1D7801",
        borderRadius: 10,
        width: 250,
        height: 40,
        marginLeft: 20,
        marginTop: 50,
        color: "black",
        backgroundColor: "#FFFF",
        textAlign: "left",
        paddingLeft: 10,
    },

    forgotPassword:{
        marginLeft: 165,
        marginVertical: 30,
        color: "blue",
        textDecorationLine: "underline",
        height: 20,
    },

    pressable:{
        flex: 1,
        marginTop: 5,
    },

    signInBtn:{
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 10,
        width: 200,
        height: 45,
        alignItems: "center",
        padding: 10,
        marginHorizontal: 50,
        marginTop: -15,
        backgroundColor: "#1D7801",
        justifyContent: "center",
    },

    signInBtnText:{
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    socialMediaContainer:{
        flex: 1,
    },

    facebook:{
        marginTop: 40,
        marginBottom: 0,
        marginLeft: -10,
    },

    instagram:{
        marginTop: -20,
        marginBottom: 0,
        marginLeft: 40,
    },

    twitter:{
        marginTop: -20,
        marginBottom: 0,
        marginLeft: 90,
    },

    welcomeContainer:{
        flex: 1,
    },

    welcome:{
        textAlign: "center",
        marginVertical: 150,
        color: "#1D7801",
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 150,
    },

    ORContainer:{
        flex: 1,
    },

    OR:{
        color: "grey",
        marginHorizontal: 140,
        marginTop: -10,
        fontSize: 20,
        width: 100,
    },

    signUpLink:{
        flex: 1,
    },

    signUpLinkText:{
        marginTop: -10,
        marginHorizontal: 70,
        width: 100,
        color: "#1D7801",
        fontWeight: "bold",
    },

    signUpLinkTextRest:{
        marginTop: -20,
        marginHorizontal: 130,
        width: 150,
        color: "grey",
    },
})