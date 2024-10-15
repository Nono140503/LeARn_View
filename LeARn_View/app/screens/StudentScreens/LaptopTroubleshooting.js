import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import questions from '../../../components/Questions';

const LaptopTroubleShooting = ({ route, navigation, score, setScore }) => {
  const { index = 0 } = route.params || {};

  // Check if index is valid
  if (index < 0 || index >= questions.length) {
    navigation.navigate('Score Screen', { score });
    return null;
  }

  const currentQuestion = questions[index];

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;

    setScore(newScore);

    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      navigation.navigate('Laptop Troubleshooting', { index: nextIndex });
    } else {
      navigation.navigate('Score Screen', { score: newScore });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionBox}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionBox: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 10,
    backgroundColor: '#EFFAF3',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});

export default LaptopTroubleShooting;
