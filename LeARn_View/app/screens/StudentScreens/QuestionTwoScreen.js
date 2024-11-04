import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import questions from '../../../components/question2'; 

const QuestionScreenTwo = ({ route, navigation, score, setScore, userAnswers, setUserAnswers }) => {
  const { index } = route.params;

  if (index < 0 || index >= questions.length) {
    navigation.navigate('ScoreTwo', { score, userAnswers });
    return null; 
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
      navigation.navigate('Question2', { index: nextIndex });
    } else {
      navigation.navigate('ScoreTwo', { score: newScore, userAnswers: updatedAnswers });
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the question number */}
      <Text style={styles.questionNumberText}>
        Question {index + 1} of {questions.length}
      </Text>
      <Image source={currentQuestion.image} style={styles.image}/>
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
  questionNumberText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  image: {
    width: 340,
    height: 240,
    marginBottom: 20,
    borderRadius: 10,
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

export default QuestionScreenTwo;
