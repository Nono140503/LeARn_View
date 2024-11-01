import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import themeContext from '../../../components/ThemeContext';

const GamesRules = ({ route, navigation }) => {

  const theme = useContext(themeContext)

  const { gameTitle, rules, gif, nav } = route.params; 
    const handleBack = () => {
        navigation.goBack();
    }
    const handleGame = () => {
        navigation.navigate(nav);
      
    };
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.gif_cont}>
          <Image source={gif} style={styles.gif}/>
      </View>
        
        <TouchableOpacity onPress={handleBack} style={styles.icon_cont}>
            <Icon name='arrow-back-outline' size={30} style={styles.icon}/>
        </TouchableOpacity>
       
      <Text style={styles.title}>{gameTitle}</Text>
      <View style={styles.rule_cont}>
        <Text style={styles.rulesHead}>Rules:</Text>
        <Text style={[styles.rules, {color: theme.color}]}>{rules}</Text>
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
  rulesHead:{
    fontSize: 18,
    color: '#3D8DCB',
    fontWeight: 'bold',
  },
  icon_cont:{
    padding: 10,
  },
  startButton:{
    backgroundColor: '#28a745',
    padding: 15,
    alignItems: 'center',
    width: '65%',
    borderRadius: 5,
    marginLeft: 65,
    bottom: 40,
  },
  gif_cont:{
    height: 280,
    width: 400,
  },
  startText:{
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon:{
    bottom: 235,
    color: 'white',
    marginLeft: 15,
  },
  gif:{
    height: '100%',
    width: '100%',
  },
  rule_cont:{
    padding: 25,
    bottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3D8DCB',
    textAlign: 'center',
    bottom: 20,
  },
  rules: {
    fontSize: 17,
    lineHeight: 24,
    color: '#333',
    
  },
});

export default GamesRules;
