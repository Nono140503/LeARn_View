import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

const easyComponents = [
  { name: 'motherboard', image: require('../../../assets/Motherboard.jpeg') },
  { name: 'central processing unit', image: require('../../../assets/CPU.jpeg') },
  { name: 'random access memory', image: require('../../../assets/RAM.jpeg') },
  { name: 'keyboard', image: require('../../../assets/Keyboard.jpeg') },
  { name: 'mouse', image: require('../../../assets/Mouse.webp') },
  { name: 'speaker', image: require('../../../assets/Speaker.jpg') },
  { name: 'usb flash drive', image: require('../../../assets/USB.jpeg') },
  { name: 'printer', image: require('../../../assets/Printer.webp') },
  { name: 'webcam', image: require('../../../assets/WebCam.webp') },
];

const mediumComponents = [
  { name: 'graphics processing unit', image: require('../../../assets/GPU.jpeg') },
  { name: 'hard disk drive', image: require('../../../assets/HDD.jpg') },
  { name: 'solid state drive', image: require('../../../assets/SSD.webp') },
  { name: 'power supply', image: require('../../../assets/Powersupply.webp') },
  { name: 'cooling system', image: require('../../../assets/Cooling.webp') },
  { name: 'sound card', image: require('../../../assets/SoundCard.jpeg') },
  { name: 'network interface card', image: require('../../../assets/NIC.jpeg') },
  { name: 'optical drive', image: require('../../../assets/OpticalDrive.jpeg') },
];

const hardComponents = [
  { name: 'thermal paste', image: require('../../../assets/ThermalPaste.jpg') },
  { name: 'case fan', image: require('../../../assets/Casefan.jpg') },
  { name: 'heat sink', image: require('../../../assets/Heatsink.jpeg') },
  { name: 'expansion card', image: require('../../../assets/ExpansionCard.webp') },
  { name: 'liquid cooling system', image: require('../../../assets/Liquid.jpeg') },
  { name: 'fiber optic card', image: require('../../../assets/FiberOpticalCard.jpeg') },
];

export default function GuessTheComponent({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState(null);
  const [components, setComponents] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState();
  const [correctSound, setCorrectSound] = useState();
  const [wrongSound, setWrongSound] = useState();
  const [gameOverSound, setGameOverSound] = useState();
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const isFocused = useIsFocused();

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
      await unloadSounds();

      const { sound: correct } = await Audio.Sound.createAsync(
        require('../../../assets/purchase-succesful-ingame-230550.mp3')
      );
      setCorrectSound(correct);

      const { sound: wrong } = await Audio.Sound.createAsync(
        require('../../../assets/negative_beeps-6008.mp3')
      );
      setWrongSound(wrong);

      const { sound: overSound } = await Audio.Sound.createAsync(
        require('../../../assets/mixkit-game-level-completed-2059.wav')
      );
      setGameOverSound(overSound);
    };

    loadSounds();

    const unsubscribe = navigation.addListener('blur', async () => {
      await unloadSounds();
    });

    return () => {
      unloadSounds();
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFeedback("Time’s up!");
      nextComponent();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isFocused && backgroundMusic) {
      backgroundMusic.playAsync();
    } else {
      unloadSounds();
    }
  }, [isFocused]);

  const handleSubmit = async () => {
    const correctAnswer = components[currentIndex].name.toLowerCase().trim();
    const userGuess = guess.toLowerCase().trim();

    if (userGuess === correctAnswer) {
      setFeedback('Correct!');
      if (correctSound) {
        await correctSound.replayAsync();
      }
      if (!guessedCorrectly) {
        setScore(score + 1);
        setGuessedCorrectly(true);
      }
    } else {
      setFeedback('Wrong! Try again.');
      handleIncorrectGuess(correctAnswer);
      if (wrongSound) {
        await wrongSound.replayAsync();
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
        await backgroundMusic.stopAsync();
      }
      if (gameOverSound) {
        await gameOverSound.playAsync();
      }
    }
  };

  const restartGame = async () => {
    await unloadSounds();
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setFeedback('');
    setGuessedCorrectly(false);
    setTimeLeft(30);
    setIncorrectAnswers([]);
    randomizeComponents(difficulty);
    if (backgroundMusic) {
      await backgroundMusic.playAsync();
    }
  };

  const handleQuit = async () => {
    Alert.alert(
      "Quit Game",
      "Are you sure you want to quit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await unloadSounds();
            if (gameOverSound) {
              try {
                await gameOverSound.playAsync();
              } catch (error) {
                console.error('Error playing game over sound:', error);
              }
            }
            setGameOver(true);
          }
        }
      ]
    );
  };

  const selectDifficulty = async (level) => {
    setDifficulty(level);
    randomizeComponents(level);
    const { sound: bgMusic } = await Audio.Sound.createAsync(
      require('../../../assets/game-music-loop-7-145285.mp3'),
      { isLooping: true }
    );
    setBackgroundMusic(bgMusic);
    await bgMusic.playAsync();
  };

  const handleIncorrectGuess = (correctAnswer) => {
    const incorrectComponent = components[currentIndex];
    setIncorrectAnswers(prev => [...prev, { component: incorrectComponent, guess, correct: correctAnswer }]);
  };

  const randomizeComponents = (level) => {
    let selectedComponents;
    switch (level) {
      case 'easy':
        selectedComponents = easyComponents;
        break;
      case 'medium':
        selectedComponents = mediumComponents;
        break;
      case 'hard':
        selectedComponents = hardComponents;
        break;
      default:
        selectedComponents = [];
        break;
    }
    setComponents(selectedComponents.sort(() => Math.random() - 0.5));
  };

  const goToMenu = () => {
    unloadSounds();
    navigation.navigate('Games Screen');
  };

  if (!difficulty) {
    return (
      <ImageBackground source={require('../../../assets/gradient-background-green-tones_23-2148388109.jpg')} style={styles.background}>
          <View style={styles.container}>
        <Text style={styles.title_select}>Select Difficulty</Text>
        <Image source={require('../../../assets/difficulty_gif.gif')} style={styles.gif}/>
        <View style={styles.difficultyContainer}>
          <TouchableOpacity style={styles.button} onPress={() => selectDifficulty('easy')}>
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => selectDifficulty('medium')}>
            <Text style={styles.buttonText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => selectDifficulty('hard')}>
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
      
    );
  }

  if (gameOver) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title_gameOver}>Game Over!</Text>
        <Image source={require('../../../assets/trophy.gif')} style={styles.trophy} />
        <Text style={styles.final_score}>Your final score: {score} / {components.length}</Text>
        {incorrectAnswers.length > 0 && (
          <>
          <View style={styles.incorrect_cont}>
          <Text style={styles.title_incorrect}>Incorrect Answers:</Text>
            {incorrectAnswers.map((item, index) => (
              <View key={index} style={styles.incorrectItem}>
                <Image source={item.component.image} style={styles.image_incorrect} />
                <View style={styles.items_}>
                      <Text style={styles.incorrectText}>Your answer: {item.guess}</Text>
                      <Text style={styles.correctText}>Correct: {item.correct}</Text>
                </View> 
              </View>
            ))}
          </View>
            
          </>
        )}
        <TouchableOpacity style={styles.buttonRestart} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={goToMenu}>
          <Text style={styles.buttonText}>Games Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ImageBackground source={require('../../../assets/gradient-background-green-tones_23-2148388109.jpg')} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title_guess}>Guess the Component!</Text>
      <View style={styles.image_cont}>
        <Image source={components[currentIndex].image} style={styles.componentImage} />
      </View>
      
      <Text style={styles.feedback}>{feedback}</Text>
      <View style={styles.time_cont}>
        <Text style={styles.timer}>Time left: {timeLeft}s</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your guess"
        value={guess}
        onChangeText={setGuess}
      />
      <View style={styles.button_cont}>
          <TouchableOpacity style={styles.submit_button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Guess</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quit_button} onPress={handleQuit}>
            <Text style={styles.buttonText}>Quit Game</Text>
          </TouchableOpacity>
      </View>
      
      <View style={styles.output}>
        <Text style={styles.progress}>Question {currentIndex + 1} of {components.length}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
    </ScrollView>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,  
    
  },
  image_cont:{
    width: 300,
    height: 200,
  },
  image_incorrect:{
    width: 100,
    height: 80,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
  },
  output:{
    alignItems:'center',
  },
  incorrect_cont:{
   padding: 8,
  },
  title_gameOver:{
    color: 'green',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
  },
  title_incorrect:{
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  quit_button:{
    backgroundColor: '#E15858',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
  },
  submit_button:{
    backgroundColor: '#08A750',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
  },
  items_:{
    marginLeft: 15,
    width: '70%',
  },
  time_cont:{
    backgroundColor: '#D0FFDA',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
  },
  button_cont:{
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  title_guess:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gif:{
    width: 200,
    height: 200,
    marginTop: 70
  },
  background:{
    flex: 1,
  }, 
   title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },
  title_select:{
    marginTop: 50,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  componentImage: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2.5,
    
  },
  difficultyContainer: {
    width: '100%',
    marginTop: 60,
  },
  input: {
    height: 40,
    borderColor: '#08A750',
    borderWidth: 1.5,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#08A750',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
  },
  buttonRestart:{
    backgroundColor: '#08A750',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '90%',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  feedback: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10
  },
  timer: {
    fontSize: 16,
    color: 'red',
  },
  progress: {
    fontSize: 18,
    marginTop: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreText: {
    fontSize: 18,
    marginTop: 10,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  final_score:{
    fontSize: 18,
    marginTop: 10,
    color: '#3D8DCB',
  },
  trophy: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  menu: {
    marginTop: 20,
    backgroundColor: '#3D8DCB',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '90%',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    marginTop: 10
  },
  
  incorrectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  incorrectText: {
    fontSize: 16,
    color: 'red',
  },
  correctText: {
    fontSize: 16,
    color: 'green',
  },
});
