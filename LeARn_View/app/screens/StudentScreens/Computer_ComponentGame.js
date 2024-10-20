import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from 'react-native-vector-icons';

const components = [
  { name: 'motherboard', image: require('../../../assets/Motherboard.jpeg') },
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

export default function GuessTheComponent({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [backgroundMusic, setBackgroundMusic] = useState();
  const [correctSound, setCorrectSound] = useState();
  const [wrongSound, setWrongSound] = useState();
  const [gameOverSound, setGameOverSound] = useState(); // Game over sound

  const unloadSounds = async () => {
    try {
      if (backgroundMusic) {
        await backgroundMusic.stopAsync();
        await backgroundMusic.unloadAsync();
      }
      if (correctSound) {
        await correctSound.stopAsync();
        await correctSound.unloadAsync();
      }
      if (wrongSound) {
        await wrongSound.stopAsync();
        await wrongSound.unloadAsync();
      }
      if (gameOverSound) {
        await gameOverSound.stopAsync();
        await gameOverSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  };

  useEffect(() => {
    const loadSounds = async () => {
      await unloadSounds(); // Stop and unload previous sounds

      // Load background music
      const { sound: bgMusic } = await Audio.Sound.createAsync(
        require('../../../assets/game-music-loop-7-145285.mp3'),
        { isLooping: true }
      );
      setBackgroundMusic(bgMusic);
      await bgMusic.playAsync();

      // Load correct sound
      const { sound: correct } = await Audio.Sound.createAsync(
        require('../../../assets/purchase-succesful-ingame-230550.mp3')
      );
      setCorrectSound(correct);

      // Load wrong sound
      const { sound: wrong } = await Audio.Sound.createAsync(
        require('../../../assets/negative_beeps-6008.mp3')
      );
      setWrongSound(wrong);

      // Load game over sound
      const { sound: overSound } = await Audio.Sound.createAsync(
        require('../../../assets/mixkit-game-level-completed-2059.wav')
      );
      setGameOverSound(overSound);
    };

    loadSounds();

    return () => {
      unloadSounds(); // Clean up sounds on component unmount
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFeedback("Time’s up!");
      nextComponent();
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    const correctAnswer = components[currentIndex].name.toLowerCase().trim();
    const userGuess = guess.toLowerCase().trim();

    if (userGuess === correctAnswer) {
      setFeedback('Correct!');
      if (correctSound) {
        await correctSound.replayAsync(); // Use replay to play again
      }
      if (!guessedCorrectly) {
        setScore(score + 1);
        setGuessedCorrectly(true);
      }
    } else {
      setFeedback('Wrong! Try again.');
      if (wrongSound) {
        await wrongSound.replayAsync(); // Use replay to play again
      }
    }

    setTimeout(nextComponent, 1000);
    setGuess('');
  };

  const nextComponent = async () => {
    if (currentIndex < components.length - 1) {
      setFeedback('');
      setGuessedCorrectly(false);
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(30);
    } else {
      setGameOver(true);
      if (backgroundMusic) {
        await backgroundMusic.stopAsync(); // Stop background music on game over
      }
      // Play the game over sound only once
      if (gameOverSound) {
        await gameOverSound.playAsync();
      }
    }
  };

  const restartGame = async () => {
    await unloadSounds(); // Stop all sounds before restarting
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setFeedback('');
    setGuessedCorrectly(false);
    setTimeLeft(30);
    if (backgroundMusic) {
      await backgroundMusic.playAsync();
    }
  };

  const handleQuit = async () => {
    Alert.alert(
      "Quit Game",
      "Are you sure you want to quit?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            await unloadSounds(); // Stop all sounds
            if (gameOverSound) {
              try {
                await gameOverSound.playAsync(); // Play game over sound
              } catch (error) {
                console.error('Error playing game over sound:', error);
              }
            }
            setGameOver(true); // Set game over state
          }
        }
      ]
    );
  };

  const handleMenu = () => {
    navigation.navigate('Games Screen');
  };

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over!</Text>
        <Image source={require('../../../assets/trophy.gif')} style={styles.trophy}/>
        <Text style={styles.scoreText}>Your final score: {score} / {components.length}</Text>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={handleMenu}>
          <Text style={styles.games_menu}>Games Menu</Text>
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
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
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
      <Text style={styles.scoreText}>Score: {score}</Text>
      <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
        <Ionicons name="exit" size={24} color="red" />
        <Text style={styles.quitText}>Quit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  trophy:{
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    color: '#3D8DCB'
  },
  menu: {
    padding: 10,
    backgroundColor: '#28a745',
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
  },
  games_menu:{
    color: 'white',
    fontSize: 15
  },
  componentNumber: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 350,
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
    borderRadius: 5,
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
  quitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  quitText: {
    marginLeft: 5,
    color: 'red',
    fontSize: 18,
  },
});
