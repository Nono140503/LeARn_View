import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function GamesHeader({navigation}) {
  const handleBack = () => {
    navigation.navigate('Home Screen');
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.icon_cont}>
          <Icon name="arrow-back-outline" size={30} style={styles.icon} onPress={handleBack} />
        </TouchableOpacity>
        <Text style={styles.title}>Games</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '8%',
    color: '#227d39',
    marginRight: '42%',
  },
  icon_cont: {
    padding: '5%',
  },
  icon: {
    top: '30%',
    color: '#227d39',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 }, 
    shadowOpacity: 0.7,
    shadowRadius: 9.65, 
    elevation: 6, 
    alignItems: 'center',
    padding: '2%',
    backgroundColor: '#EFFAF3',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GamesHeader;
