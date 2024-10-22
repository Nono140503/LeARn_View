import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
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
    <ImageBackground
      source={require('../../../assets/theme.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.check}>Check Your Knowledge</Text>
        <Image source={currentQuestion.image} style={styles.image} />
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
        <TouchableOpacity>
          <Text>Quit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    width: '100%',
  },
  check: {
    marginBottom: 20,
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 50,
  },
  image: {
    width: 200,
    height: 150,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
    color: 'white',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionBox: {
    width: '90%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 10,
    backgroundColor: '#EFFAF3',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});

export default LaptopTroubleShooting;
