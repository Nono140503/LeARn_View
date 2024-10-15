import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ScoreScreen = ({ navigation, score, setScore }) => {
  // Feedback based on the score
  let feedback;
  if (score >= 10) {
    feedback = "Excellent, keep it up!";
  } else if (score >= 8) {
    feedback = "Great, keep going!";
  } else if (score >= 6) {
    feedback = "Average, better luck next time!";
  } else {
    feedback = "Poor try, better luck next time!";
  }

  // Restart button functionality
  const handleRestart = () => {
    setScore(0);  // Reset the score
    navigation.navigate('Laptop Troubleshooting', { index: 0, score: 0 });  // Navigate to first question
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Your Score: {score}/12</Text>
      <Text style={styles.feedbackText}>{feedback}</Text>
      <Button title="Restart" onPress={handleRestart} />
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

export default ScoreScreen;
