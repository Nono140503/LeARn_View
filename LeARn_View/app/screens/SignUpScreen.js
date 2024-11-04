import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, SafeAreaView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Assuming firebase.js is in the parent folder
import themeContext from '../../components/ThemeContext';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLecturer, setIsLecturer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false); // New state to control visibility
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [notificationSound, setNotificationSound] = useState('NotificationSounds/notification1.wav')

  const [studentNumber, setStudentNumber] = useState('');
  const [course, setCourse] = useState('BIT');
  const [year, setYear] = useState('First Year')

  const theme = useContext(themeContext);

  const generateStudentNumber = () => {
    const studentNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
    return studentNumber;
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const role = isLecturer ? 'lecturer' : 'student';

      const studentNumber = generateStudentNumber()

      // Set User Information
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
        darkMode,
        profileImage,
        notificationSound,
      });

      // Set Student Information
      await setDoc(doc(db, 'students', user.uid), {
        username,
        studentNumber,
        course,
        year,
      })

      Alert.alert('Sign Up Successful', `Welcome ${username}!`);
      navigation.navigate('Login Screen');
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Sign Up Error', errorMessage);
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

  const { minLengthMet, hasNumber, hasSpecialChar, hasUpperCase } = checkPasswordRequirements();

  // Update showRequirements state when password is typed
  const handlePasswordChange = (text) => {
    setPassword(text);
    setShowRequirements(true); // Show requirements when user starts typing
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={[styles.title, {color: theme.color}]}>Sign Up</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <TextInput
              style={[styles.input, {color: theme.color}]}
              placeholder="Username"
              placeholderTextColor={theme.placeholderTextColor}
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.input, {color: theme.color}]}
              placeholder="Email"
              placeholderTextColor={theme.placeholderTextColor}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <TextInput
                style={[styles.input, {color: theme.color}]}
                placeholder="Password"
                placeholderTextColor={theme.placeholderTextColor}
                value={password}
                onChangeText={handlePasswordChange} // Use the new handler
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.peekButton}>
                <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>

              {/* Show requirements only if the user starts typing the password */}
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
                style={[styles.input, {color: theme.color}]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.placeholderTextColor}
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
                <Text style={[styles.radioLabel, {color: theme.color}]}>Request Lecturer credentials</Text>
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
});

export default SignUpScreen;
