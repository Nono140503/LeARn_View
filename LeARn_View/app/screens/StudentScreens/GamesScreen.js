import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      rules: 'Challenge your knowledge of computer fundamentals, terminology, and concepts',
      gif: require('../../../assets/I Have An Idea!.gif'),
      nav: 'Laptop Troubleshooting',
    },
    {
      title: 'Malware Mayhem',
      image: require('../../../assets/malware.jpeg'),
      rules: 'Identify and eliminate malware threats before they cause damage.',
      gif: require('../../../assets/The Hacker.gif'),
      nav: '',
    },
  ];

  return (
    <View style={styles.container}>
      <GamesHeader navigation={navigation} currentScreen={currentScreen} onNavigate={handleNavigation} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFFAF3',
  },
  content: {
    padding: 15,
    paddingBottom: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },
  componentItem: {
    width: '48%', 
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
    color: '#3D8DCB',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10, 
  },
});

export default GamesScreen;
