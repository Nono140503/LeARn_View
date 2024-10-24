import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import questions from '../../../components/questionThree'; // Import your questions

const QuestionScreenThree = ({ route, navigation, score, setScore, userAnswers, setUserAnswers }) => {
  const { index } = route.params;

  if (index < 0 || index >= questions.length) {
    navigation.navigate('ScoreThree', { score, userAnswers });
    return null; // Prevent rendering
  }

  const currentQuestion = questions[index];

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;

    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = selectedOption;
    setUserAnswers(updatedAnswers);
    setScore(newScore); 

    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      navigation.navigate('Question3', { index: nextIndex });
    } else {
      navigation.navigate('ScoreThree', { score: newScore, userAnswers: updatedAnswers });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, idx) => (
          <TouchableOpacity key={idx} style={styles.optionBox} onPress={() => handleAnswer(option)}>
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
    backgroundColor: '#261376',
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
    borderWidth: 3,
    borderColor: '#003EDA',
    borderRadius: 10,
    backgroundColor: '#EFFAF3',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  optionText: {
    fontSize: 16,
  },
});

export default QuestionScreenThree;
