import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GamesHeader from '../../../components/GamesHeader';

const GamesScreen = ({ navigation }) => {
  // Define an array with game details
  const [currentScreen, setCurrentScreen] = useState('Games Screen');

  const handleNavigation = (screen) => {
      setCurrentScreen(screen);
      navigation.navigate(screen);
  };
  const games = [
    {
      title: 'Computer Components',
      image: require('../../../assets/computer-assembly-pc-building-hardware-600nw-2229132749.jpg'),
      rules: 'Rules:\nIdentify and assemble various parts of a computer to complete the build.',
      gif: require('../../../assets/06Techfix-illo-superJumbo.gif'),
      nav: 'Computer Components'
    },
    {
      title: 'Check Your Knowledge',
      image: require('../../../assets/concept-computer-repair-service-vector-illustration_357257-792.jpg'),
      rules: 'Rules:\nChallenge your knowledge of computer fundamentals, terminology, and concepts',
      gif: require('../../../assets/I Have An Idea!.gif'),
      nav: 'Laptop Troubleshooting',
    },
    {
      title: 'Malware Mayhem',
      image: require('../../../assets/malware.jpeg'),
      rules: 'Rules:\nIdentify and eliminate malware threats before they cause damage.',
      gif: require('../../../assets/The Hacker.gif'),
      nav: ''
    },
  ];

  return (
    <View style={styles.container}>
      <GamesHeader 
              navigation={navigation} 
             currentScreen={currentScreen}
             onNavigate={handleNavigation}/>
      <ScrollView contentContainerStyle={styles.content}>
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
                  nav: game.nav
                });
             
            }}
          >
            <Image source={game.image} style={styles.componentImage} />
            <View style={styles.overlay}>
              <Text style={styles.componentTitle}>{game.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  componentItem: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5.5,
  },
  componentImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  componentTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GamesScreen;
