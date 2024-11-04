import React from 'react';
import { View, Text, StyleSheet, Button, Image , TouchableOpacity} from 'react-native';
import questions from '../../../components/question2';

const ScoreScreenTwo = ({ route, navigation, resetQuiz }) => {
  const score = route.params?.score || 0;
  const totalQuestions = questions.length;

  let image;
  let feedback;
  if (score >= totalQuestions * 0.83) {
    feedback = "Excellent, keep it up!";
    image= require('../../../assets/trophy.gif');
  } else if (score >= totalQuestions * 0.67) {
    feedback = "Great, keep going!";
    image= require('../../../assets/Auth Genially.gif');
  } else if (score >= totalQuestions * 0.50) {
    feedback = "Average, better luck next time!";
    image= require('../../../assets/You Got It Yes Sticker by Emoji - Find & Share on GIPHY.gif');
  } else {
    feedback = "Poor try, better luck next time!";
    image= require('../../../assets/Sad-Cry-Sticker-Sad-Cry-Emoji--unscreen.gif');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.gameOver}>Game Over!</Text>
      <Image source={image} style={styles.gif}/>
      <Text style={styles.scoreText}>Your Score: {score}/{totalQuestions}</Text>
      <Text style={styles.feedbackText}>{feedback}</Text>
      <Button title="Back to Home" onPress={() => { resetQuiz(); navigation.navigate('Home'); }} />
      <Button title="View Corrections" onPress={() => navigation.navigate('CorrectionsTwo', { userAnswers: route.params.userAnswers })} />
      <TouchableOpacity
      onPress={() => {
        navigation.navigate('Corrections', { userAnswers: route.params.userAnswers });
      }} 
      style={styles.corrections}>
          <Text style={styles.text}>View Corrections</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => {
        resetQuiz(); 
        navigation.navigate('Check Your Knowledge');
      }} 
      style={styles.buttonMenu}>
          <Text style={styles.text}>Back To Menu</Text>
      </TouchableOpacity>
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
  corrections:{
    padding: 15,
    backgroundColor: '#28a745',
    width: '75%',
    alignItems: 'center',
    borderRadius: 5,
    
  },
  buttonMenu:{
    padding: 15,
    backgroundColor: '#3D8DCB',
    width: '75%',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  text:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  gif:{
    height: 200,
    width: 200,
    marginTop: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  gameOver:{
    marginTop: 30,
    fontSize: 25,
    fontWeight: 'bold',
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