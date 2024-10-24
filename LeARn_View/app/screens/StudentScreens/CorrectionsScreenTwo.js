import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import questions from '../../../components/question2';

const CorrectionsScreenTwo = ({ route }) => {
  const { userAnswers } = route.params;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Corrections</Text>
        {questions.map((question, index) => {
          if (userAnswers[index] !== question.answer) {
            return (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                <Text style={styles.answerText}>
                  Your answer: {userAnswers[index] || 'No answer provided.'}
                </Text>
                <Text style={styles.correctText}>
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
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  correctText: {
    fontSize: 16,
    color: 'green',
  },
  answerText: {
    fontSize: 16,
    color: 'red',
  },
});

export default CorrectionsScreenTwo;