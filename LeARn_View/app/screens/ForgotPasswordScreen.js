import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase'; 
import GreenOkAlert from '../../components/OkAlert'; 
import themeContext from '../../components/ThemeContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const theme = useContext(themeContext);

  const handlePasswordReset = async () => {
    if (!email) {
      setAlertTitle('Missing Email');
      setAlertMessage('Please enter your email address.');
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setAlertTitle('Password Reset');
      setAlertMessage('An email has been sent to reset your password.');
      setShowAlert(true);
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage(error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertOk = () => {
    setShowAlert(false);
    if (alertTitle === 'Password Reset') {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Text style={[styles.title, {color: theme.color}]}>Reset Password</Text>
      <TextInput
        style={[styles.input, {color: theme.color}]}
        placeholder="Email"
        placeholderTextColor={theme.placeholderTextColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <GreenOkAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onOk={handleAlertOk}
      />
    </View>
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
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;