import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import GamesHeader from '../../../components/GamesHeader';

const GamesScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Games Screen');

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    navigation.navigate(screen);
  };

  const games = [
    {
      title: 'Computer Components',
      image: require('../../../assets/computer-assembly-pc-building-hardware-600nw-2229132749.jpg'),
      rules: '1. Enter the name of the component displayed in the image\n2. Make sure that you enter the full name of the component!\n3 You have 30 seconds to answer each question.\n4. If your time finishes, the game will move to the next question.\n5 You cannot go to the previous question if the time finishes.\n6. Good luck and Enjoy!',
      gif: require('../../../assets/06Techfix-illo-superJumbo.gif'),
      nav: 'Computer Components',
    },
    {
      title: 'Check Your Knowledge',
      image: require('../../../assets/concept-computer-repair-service-vector-illustration_357257-792.jpg'),
      rules: 'Challenge your knowledge of computer fundamentals, terminology, and concepts\n1. Select the module you would like to practice\n2. Select the answer that best suits the question',
      gif: require('../../../assets/I Have An Idea!.gif'),
      nav: 'Check Your Knowledge',
    },
    {
      title: 'Malware Mayhem',
      image: require('../../../assets/malware.jpeg'),
      rules: 'Identify and eliminate malware threats before they cause damage.\n1.The onjective is to identify the malware in the given scenario.\n2.Select level of Difficulty\n3.Select the answer that best suits the scenario',
      gif: require('../../../assets/The Hacker.gif'),
      nav: 'Malware Mayhem',
    },
  ];

  return (
    <View style={styles.container}>
      <GamesHeader navigation={navigation} currentScreen={currentScreen} onNavigate={handleNavigation} />
      <ImageBackground source={require('../../../assets/gradient-background-green-tones_23-2148388109.jpg')} style={styles.background}>
        
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.gamesGrid}>
            {games.map((game, index) => (
              <TouchableOpacity
                key={index}
                style={styles.componentItem}
                onPress={() => {
                  navigation.navigate('Game Rules', {
                    gameTitle: game.title,
                    gameImage: game.image,
                    rules: game.rules,
                    gif: game.gif,
                    nav: game.nav,
                  });
                }}
              >
                <Image source={game.image} style={styles.componentImage} />
                <Text style={styles.componentTitle}>{game.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject, // Ensures the overlay covers the entire background
  //   backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black color
  // },
  content: {
    padding: 15,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },
  componentItem: {
    width: '45%', 
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5.5,
  },
  componentImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  componentTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10, 
  },
});

export default GamesScreen;
