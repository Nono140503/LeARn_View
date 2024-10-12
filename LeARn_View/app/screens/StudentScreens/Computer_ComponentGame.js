import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const components = [
  { name: 'motherboard', image: require('../../../assets/Motherboard') },
  { name: 'central processing unit', image: require('../../../assets/CPU.jpeg') },
  { name: 'random access memory', image: require('../../../assets/RAM.jpeg') },
  { name: 'graphics processing unit', image: require('../../../assets/GPU.jpeg') },
  { name: 'hard disk drive', image: require('../../../assets/HDD.jpg') },
  { name: 'solid state drive', image: require('../../../assets/SSD.webp') },
  { name: 'power supply', image: require('../../../assets/Powersupply.webp') },
  { name: 'cooling system', image: require('../../../assets/Cooling.webp') },
  { name: 'sound card', image: require('../../../assets/SoundCard.jpeg') },
  { name: 'network interface card', image: require('../../../assets/NIC.jpeg') },
];

export default function GuessTheComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Timer set to 30 seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFeedback('Time’s up!');
      nextComponent();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    const correctAnswer = components[currentIndex].name.toLowerCase().trim();
    const userGuess = guess.toLowerCase().trim();
    
    if (userGuess === correctAnswer) {
      setFeedback('Correct!');
      if (!guessedCorrectly) {
        setScore(score + 1);
        setGuessedCorrectly(true);
      }
    } else {
      setFeedback('Wrong! Try again.');
    }
    
    
    setTimeout(nextComponent, 1000); 
    setGuess('');
  };

  const nextComponent = () => {
    if (currentIndex < components.length - 1) {
      setFeedback('');
      setGuessedCorrectly(false);
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(30)
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setFeedback('');
    setGuessedCorrectly(false);
    setTimeLeft(30); 
  };

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.scoreText}>Your final score: {score} / {components.length}</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Guess the Component!</Text>
      <Text style={styles.componentNumber}>
        Component {currentIndex + 1} / {components.length}
      </Text>
      <Image source={components[currentIndex].image} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Type your guess"
        value={guess}
        onChangeText={setGuess}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Guess</Text>
      </TouchableOpacity>
      <Text style={styles.feedback}>{feedback}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  componentNumber: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  feedback: {
    fontSize: 18,
    marginBottom: 10,
  },
  timer: {
    fontSize: 18,
    marginBottom: 20,
    color: 'red',
  },
  scoreText: {
    fontSize: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
