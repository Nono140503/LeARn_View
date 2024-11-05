import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, SafeAreaView, ImageBackground
} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; 
import GreenOkAlert from '../../components/OkAlert'; 
import GreenYesNoAlert from '../../components/YesNoAlert'; 

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLecturer, setIsLecturer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showOkAlert, setShowOkAlert] = useState(false);
  const [showYesNoAlert, setShowYesNoAlert] = useState(false); 
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setAlertTitle('Missing Fields');
      setAlertMessage('Please fill in all fields.');
      setShowOkAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertTitle('Password Mismatch');
      setAlertMessage('Passwords do not match.');
      setShowOkAlert(true);
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const role = isLecturer ? 'lecturer' : 'student';

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
      })
      .then(() => {
        console.log('User data written to Firestore!');
        setAlertTitle('Sign Up Successful');
        setAlertMessage(`Welcome ${username}! A verification email has been sent to ${email}. Please verify your email before logging in.`);
        setShowOkAlert(true);
      })
      .catch((error) => {
        console.error('Error writing user data to Firestore:', error);
        setAlertTitle('Database Error');
        setAlertMessage('An error occurred while saving your information. Please try again later.');
        setShowOkAlert(true);
      });

    } catch (error) {
      let errorTitle = 'Sign Up Error';
      let errorMessage = 'An unexpected error occurred. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorTitle = 'Email Already in Use';
          errorMessage = 'This email address is already associated with an account. Please use a different email or try logging in.';
          break;
        case 'auth/invalid-email':
          errorTitle = 'Invalid Email';
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorTitle = 'Weak Password';
          errorMessage = 'Please choose a stronger password. It should be at least 6 characters long.';
          break;
        case 'auth/network-request-failed':
          errorTitle = 'Network Error';
          errorMessage = 'Please check your internet connection and try again.';
          break;
      }

      setAlertTitle(errorTitle);
      setAlertMessage(errorMessage);
      setShowOkAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordRequirements = () => {
    const minLengthMet = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    return { minLengthMet, hasNumber, hasSpecialChar, hasUpperCase };
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setShowRequirements(true);
  };

  const { minLengthMet, hasNumber, hasSpecialChar, hasUpperCase } = checkPasswordRequirements();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.imageContainer}>
        <ImageBackground source={require('../../assets/LV_logo.png')} style={styles.backgroundLogo} resizeMode='cover'/>
        </View>

        <Text style={styles.title}>Sign Up</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.peekButton}>
                <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>

              {showRequirements && (
                <View style={styles.requirementsContainer}>
                  {(!minLengthMet || !hasNumber || !hasSpecialChar || !hasUpperCase) && (
                    <>
                      <Text style={{ color: minLengthMet ? 'green' : 'red' }}>• At least 8 characters</Text>
                      <Text style={{ color: hasNumber ? 'green' : 'red' }}>• At least 1 number</Text>
                      <Text style={{ color: hasSpecialChar ? 'green' : 'red' }}>• At least 1 special character</Text>
                      <Text style={{ color: hasUpperCase ? 'green' : 'red' }}>• At least 1 capital letter</Text>
                    </>
                  )}
                </View>
              )}
            </View>

            <View>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.peekButton}>
                <Text>{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setIsLecturer(!isLecturer)}
              >
                <View style={[styles.radioOuter, isLecturer && styles.radioSelected]}>
                  {isLecturer && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Request Lecturer credentials</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#28a745" />
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login Screen')}>
              <Text style={styles.linkText}>Already have an account? Log in</Text>
            </TouchableOpacity>

            <GreenOkAlert
              visible={showOkAlert}
              title={alertTitle}
              message={alertMessage}
              onOk={() => {
                setShowOkAlert(false);
                if (alertTitle === 'Sign Up Successful') {
                  navigation.navigate('Login Screen');
                }
              }}
            />

            <GreenYesNoAlert
              visible={showYesNoAlert}
              title={alertTitle}
              message={alertMessage}
              onYes={() => {
                setShowYesNoAlert(false);
              }}
              onNo={() => setShowYesNoAlert(false)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 50,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
 button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#28a745',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  peekButton: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  requirementsContainer: {
    marginTop: 5,
  },
  backgroundLogo:{
    width: 100,  
    height: 100,  
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 20,
    top: 0, 
    left: 0, 
    opacity: 1,
  },
  imageContainer:{
    marginTop: 20,
  }
});

export default SignUpScreen;