import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, Button } from 'react-native';
=======
import { View, Text, StyleSheet, Button, Image, TouchableOpacity} from 'react-native';
>>>>>>> parent of cda7e02 (Added Changes)
import questions from '../../../components/questionFour'; // Adjust the path as necessary

const ScoreScreenFour = ({ route, navigation, resetQuiz }) => {
  const score = route.params?.score || 0; // Safely extract score
  const totalQuestions = questions.length;

  let feedback;
  if (score >= totalQuestions * 0.83) {
    feedback = "Excellent, keep it up!";
  } else if (score >= totalQuestions * 0.67) {
    feedback = "Great, keep going!";
  } else if (score >= totalQuestions * 0.50) {
    feedback = "Average, better luck next time!";
  } else {
    feedback = "Poor try, better luck next time!";
  }

  return (
    <View style={styles.container}>
<<<<<<< HEAD
=======
      <Text style={styles.gameOver}>Game Over!</Text>
      <Image source={image} style={styles.gif}/>
>>>>>>> parent of cda7e02 (Added Changes)
      <Text style={styles.scoreText}>Your Score: {score}/{totalQuestions}</Text>
      <Text style={styles.feedbackText}>{feedback}</Text>
      <Button title="Back to Home" onPress={() => { resetQuiz(); navigation.navigate('Home'); }} />
      <Button title="View Corrections" onPress={() => navigation.navigate('CorrectionsFour', { userAnswers: route.params.userAnswers })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
    color: 'green',
  },
  feedbackText: {
    fontSize: 20,
    marginBottom: 40,
    textAlign: 'center',
    color: 'green',
  },
});

export default ScoreScreenFour;

