import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const GamesScreen = () => {
  const components = [
    {
      title: 'Computer Components',
      image: require('../../../assets/SSD.webp'), 
      onPress: () => console.log('Computer Components pressed'),
    },
    {
      title: 'Laptop Troubleshooting',
      image: require('../../../assets/HDD.jpg'), 
      onPress: () => console.log('Laptop Troubleshooting pressed'),
    },
    {
      title: 'Malwares',
      image: require('../../../assets/RAM.jpeg'), 
      onPress: () => console.log('Malwares pressed'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {components.map((component, index) => (
          <TouchableOpacity key={index} style={styles.componentItem} onPress={component.onPress}>
            <Image source={component.image} style={styles.componentImage} />
            <View style={styles.overlay}>
              <Text style={styles.componentTitle}>{component.title}</Text>
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
    backgroundColor: 'white',
    marginTop:20
  },
  header: {
    padding: 20,
    backgroundColor: 'white', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#1D7801', 
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    paddingBottom: 20,
  },
  componentItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
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
  },
  componentTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GamesScreen;
