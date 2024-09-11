import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

export default function SignIn({navigation}) {

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
            Alert.alert(`Welcome ${username}`);
            navigation.navigate('Home Screen');
        }
        else{
            Alert.alert(`Invalid`)
        }
    }
    const handleSignUp = () =>{
        navigation.navigate('Sign Up');
    }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>

            <ScrollView>

                <View style={styles.logo_cont}>
                    <Image source={require('../../assets/LV_logo.png')} style={styles.logo}/>
                </View>

                <View style={styles.welcomeContainer}>
                    
                    <Text style={styles.welcome}>Welcome Back!</Text>
                </View>

                <View style={styles.signInCard}>

                    {/* Email Input */}
                    <View style={styles.emailContainer}>
                        <TextInput style={styles.input} placeholder='Email' value={username} onChangeText={setUsername}></TextInput>
                    </View>

                    {/* Password Input */}
                    <View style={styles.userPasswordContainer}>
                        <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} textContentType='password' secureTextEntry={true}></TextInput>
                    </View>


                    <View>

                    <View style={styles.forgotPasswordContainer}>

                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </View>

                    <TouchableOpacity style={styles.signInBtn} activeOpacity={0.7} onPress={handleSignIn}>
                                <Text style={styles.signInBtnText}>Log In</Text>
                        </TouchableOpacity>

                    <View >
                        <Text style={styles.OR}>
                            OR
                        </Text>
                    </View>


                    {/* Sign Up Link */}
                    <View style={styles.signUpLink}>
                        <Pressable onPress={handleSignUp}>
                            <Text style={styles.signUpLinkText}>Sign Up</Text>
                        </Pressable>

                        <Text style={styles.signUpLinkTextRest}>to join LeARn_View</Text>
                    </View>

                    <View style={styles.socialMediaContainer}>
                        <Icon name='logo-facebook' size={25} style={styles.facebook}/>
                        <Icon name='logo-instagram' size={25} style={styles.instagram}/>
                        <Icon name='logo-twitter' size={25} style={styles.twitter}/>

                    </View>
                </View>
                </View>
            </ScrollView>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    logo:{
        width: 150,
        height: 150,
    },

    signInCard:{
       alignItems: 'center',
    },

    input:{
        borderWidth: 1,
        borderColor: "#1D7801",
        borderRadius: 10,
        width: 280,

        // marginLeft: 70,
        marginTop: 10,
        color: "black",

        fontSize: 15,

        backgroundColor: "#FFFF",
        textAlign: "left",
        padding: 10,
    },

    forgotPassword:{
        marginLeft: 210,
        marginTop: 10,
        color: "blue",
        textDecorationLine: "underline",
        height: 20,
        width: '80%'
    },

    pressable:{
        flex: 1,
        marginTop: 5,
    },

    signInBtn:{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'transparent',
        width: 200,
        height: 50,
        alignItems: "center",
        padding: 10,
        backgroundColor: "#1D7801",
        justifyContent: "center",
        marginLeft: 50,
        marginTop: 10,
    },

    signInBtnText:{
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },

    socialMediaContainer:{
        marginTop: 60,
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto',
    },

    facebook:{
        marginRight: 15,
        
    },

    instagram:{
        marginRight: 15,
    },

    twitter:{
        
    },

   
    welcome:{
        textAlign: "center",
        color: "#1D7801",
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 20,
    },
    logo_cont:{
        alignItems: 'center',
        marginTop: 60,
    },


    OR:{
        color: "grey",
        marginTop: 10,
        marginLeft: 140,
        fontSize: 20,
        width: 100,
    },

    signUpLink:{
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 15,
    },

    signUpLinkText:{
        width: 100,
        color: "#1D7801",
        fontWeight: "bold",
        left: 30,
        fontSize: 16
    },

    signUpLinkTextRest:{
        width: 150,
        color: "grey",
        fontSize: 16,
    },
})
