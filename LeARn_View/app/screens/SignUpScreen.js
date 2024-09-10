import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
// import { RadioButton } from 'react-native-paper'; 

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role

  // Validate email using @
  const validateEmail = (email) => {
    const emailchecker = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailchecker.test(email);
  };

  // Validate password. At least 8 characters, one uppercase and one number
  const validatePassword = (password) => {
    const passwordchecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordchecker.test(password);
  };

  // Checks user input
  const handleSignUp = () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    if (!password) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }

    if (!confirmPassword) {
      Alert.alert('Missing Confirm Password', 'Please confirm your password.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    // Proceed with sign-up logic
    Alert.alert('Success', 'Account created successfully!');
    navigation.navigate('Home Screen')
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.createAccountText}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
        />

        <View style={styles.radioContainer}>
         

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setRole('lecturer')}
          >
            <View style={[styles.radioOuter, role === 'lecturer' && styles.radioSelected]}>
              {role === 'lecturer' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>Request Lecturer credentials</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login Screen')}>
          <Text style={styles.logInText}>Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100, 
    height: 100, 
  },
  createAccountText: {
    fontSize: 30,
    fontWeight: 'bold', 
    color: '#1D7801',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: '#1D7801', 
    borderWidth: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
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
    borderColor: '#1D7801',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1D7801',
  },
  radioSelected: {
    borderColor: '#1D7801',
  },
  radioLabel: {
    fontSize: 16,
    color: 'grey',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1D7801',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    color: 'lightgrey',
    marginBottom: 10,
  },
  logInText: {
    color: '#27A301',
    fontSize: 16,
  },
});

export default SignUpScreen;
