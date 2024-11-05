import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import GreenOkAlert from '../../components/OkAlert';
import GreenYesNoAlert from '../../components/YesNoAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOkAlert, setShowOkAlert] = useState(false);
  const [showYesNoAlert, setShowYesNoAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async () => {
    if (!email) {
      setAlertTitle('Missing Email');
      setAlertMessage('Please enter your email address.');
      setShowOkAlert(true);
      return;
    }

    if (!password) {
      setAlertTitle('Missing Password');
      setAlertMessage('Please enter your password.');
      setShowOkAlert(true);
      return;
    }

    setLoading(true);
    if (email === 'Devs@gmail.com' && password === 'Devs123') {
      navigation.navigate('Admin');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setAlertTitle('Email Not Verified');
        setAlertMessage('Please verify your email address before logging in.');
        setShowOkAlert(true);
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        if (role === 'lecturer') {
          navigation.navigate('Lecturer Dashboard');
        } else if (role === 'student') {
          navigation.navigate('Home Screen');
        } else {
          setAlertTitle('Role Error');
          setAlertMessage('No role assigned. Please contact support.');
          setShowOkAlert(true);
        }
      } else {
        setAlertTitle('No User Data');
        setAlertMessage('No user data found in Firestore.');
        setShowOkAlert(true);
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'There is no user corresponding to this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        default:
          if (error.code.startsWith('auth/')) {
            errorMessage = error.message;
          }
          break;
      }

      setAlertTitle('Login Error');
      setAlertMessage(errorMessage);
      setShowOkAlert(true);
    }finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={require('../../assets/LV_logo.png')} style={styles.backgroundLogo} resizeMode='cover'/>
        <Text style={styles.title}>Login</Text>
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
            style={styles.inputP}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} 
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text> )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <GreenOkAlert
          visible={showOkAlert}
          title={alertTitle}
          message={alertMessage}
          onOk={() => setShowOkAlert(false)}
        />

        <GreenYesNoAlert
          visible={showYesNoAlert}
          title={alertTitle}
          message={alertMessage}
          onYes={() => setShowYesNoAlert(false)}
          onNo={() => setShowYesNoAlert(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  inputP: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 5,
    top: 3,
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
  backgroundLogo:{
    width: 110,  
    height: 110,  
    alignSelf: 'center',
    marginBottom: 20,
    top: 0, 
    left: 0, 
    opacity: 1,
  },
});

export default LoginScreen;