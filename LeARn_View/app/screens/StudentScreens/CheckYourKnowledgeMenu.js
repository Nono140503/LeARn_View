import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const CheckYourKnowledgeMenu = ({ navigation }) => {

  return (
    <ScrollView style={styles.cont}>
      <View style={styles.container}>
        <Text style={styles.title}>Test Your Knowledge </Text>
        
        <TouchableOpacity onPress={() => navigation.navigate('Question', { index: 0, score: 0, userAnswers: [] })}>
          <View style={styles.imageContainer}>
            <Image source={require('../../../assets/cartoon-personal-computer-components-vector-17301596.jpg')} style={styles.image} />
            <View style={styles.textOverlay}>
              <Text style={styles.imageText}>Module 1: Computer components</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Question2', { index: 0, score: 0, userAnswers: [] })}>
          <View style={styles.imageContainer}>
            <Image source={require('../../../assets/motherboards.jpg')} style={styles.image} />
            <View style={styles.textOverlay}>
              <Text style={styles.imageText}>Module 2: Motherboards</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Question3', { index: 0, score: 0, userAnswers: [] })}>
          <View style={styles.imageContainer}>
            <Image source={require('../../../assets/processors.jpg')} style={styles.image} />
            <View style={styles.textOverlay}>
              <Text style={styles.imageText}>Module 3: Processors and Memory</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Question4', { index: 0, score: 0, userAnswers: [] })}>
          <View style={styles.imageContainer}>
            <Image source={require('../../../assets/networking.jpg')} style={styles.image} />
            <View style={styles.textOverlay}>
              <Text style={styles.imageText}>Module 4: Networking</Text>
            </View>
          </View>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
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
  cont:{
    backgroundColor: '#261376',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  imageContainer: {
    width: 320,
    height: 170,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  imageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CheckYourKnowledgeMenu;
