import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import questions from '../../../components/Questions'; 

const QuestionScreen = ({ route, navigation, score, setScore, userAnswers, setUserAnswers }) => {
  const { index } = route.params;

  if (index < 0 || index >= questions.length) {
    navigation.navigate('Score');
    return null; 
  }

  const currentQuestion = questions[index];

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;

    // Update user answers
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = selectedOption;
    setUserAnswers(updatedAnswers);
    setScore(newScore); 

    // Navigate to the next question or score screen
    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      navigation.navigate('Question', { index: nextIndex });
    } else {
      navigation.navigate('Score', {
        score: newScore,
        userAnswers: updatedAnswers,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
      {/* Display question number / progress */}
      <Text style={styles.progressText}>Question {index + 1} of {questions.length}</Text>

      <Image source={currentQuestion.image} style={styles.questionImage} />

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#261376', 
  },
  scrollViewContainer: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#261376', 
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
  questionImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
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

export default QuestionScreen;
