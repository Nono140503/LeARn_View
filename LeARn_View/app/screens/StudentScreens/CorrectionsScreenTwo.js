import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import questions from '../../../components/question2';
import themeContext from '../../../components/ThemeContext';

const CorrectionsScreenTwo = ({ route }) => {
  const { userAnswers } = route.params;
  const theme = useContext(themeContext);

  return (
    <ScrollView>
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.title, {color: theme.color}]}>Corrections</Text>
        {questions.map((question, index) => {
          if (userAnswers[index] !== question.answer) {
            return (
              <View key={index} style={[styles.questionContainer, {backgroundColor: theme.backgroundColor}]}>
                <Text style={[styles.questionText, {color: theme.color}]}>{question.question}</Text>
                <Text style={[styles.answerText, {color: theme.color}]}>
                  Your answer: {userAnswers[index] || 'No answer provided.'}
                </Text>
                <Text style={[styles.correctText, {color: theme.color}]}>
                  Correct answer: {question.answer}
                </Text>
              </View>
            );
          }
          return null; // Skip if the answer is correct
        })}
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,          
    borderColor: 'green',    
    elevation: 1,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',     
    color: 'black',
  },
  answerText: {
    fontSize: 16,
    fontStyle: 'italic',     
    color: 'red',
  },
  correctText: {
    fontSize: 16,
    color: 'green',
  },
});

export default CorrectionsScreenTwo;