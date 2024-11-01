import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import questions from '../../../components/question2';

const ScoreScreenTwo = ({ route, navigation, resetQuiz }) => {
  const score = route.params?.score || 0;
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
      <Text style={styles.scoreText}>Your Score: {score}/{totalQuestions}</Text>
      <Text style={styles.feedbackText}>{feedback}</Text>
      <Button title="Back to Home" onPress={() => { resetQuiz(); navigation.navigate('Home'); }} />
      <Button title="View Corrections" onPress={() => navigation.navigate('CorrectionsTwo', { userAnswers: route.params.userAnswers })} />
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

export default ScoreScreenTwo;