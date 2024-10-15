import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const GamesRules = ({ route, navigation }) => {
  const { gameTitle, rules, gif, nav } = route.params; 
    const handleBack = () => {
        navigation.goBack();
    }
    const handleGame = ()=>{
        navigation.navigate(nav);
    }
  return (
    <View style={styles.container}>
        <Image source={gif} style={styles.gif}/>
        <TouchableOpacity onPress={handleBack}>
            <Icon name='arrow-back-outline' size={35} style={styles.icon}/>
        </TouchableOpacity>
       
      <Text style={styles.title}>{gameTitle}</Text>
      <View style={styles.rule_cont}>
        <Text style={styles.rules}>{rules}</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handleGame}>
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#EFFAF3',
  },
  startButton:{
    backgroundColor: '#28a745',
    padding: 15,
    alignItems: 'center',
    width: '65%',
    borderRadius: 5,
    marginLeft: 65,
    marginTop: 40,
  },
  startText:{
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon:{
    bottom: 250,
    color: 'white',
    marginLeft: 20,
  },
  gif:{
    height: 280,
    width: 400,
  },
  rule_cont:{
    padding: 20,
    bottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3D8DCB',
    textAlign: 'center',
    bottom: 20,
  },
  rules: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    
  },
});

export default GamesRules;
