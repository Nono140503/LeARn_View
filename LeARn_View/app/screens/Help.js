import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Icon name="menu" size={30} color="#fff" onPress={() => navigation.openDrawer()} /> */}
        <Text style={styles.headerText}>Help</Text>
      </View>
      {/* <View style={styles.header}>
        <Text>Help</Text>
      </View> */}

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.option}>
          <Icon name="tv-outline" size={30} color="#006400" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Tutorials</Text>
            <Text style={styles.description}>Videos/Articles</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="call-outline" size={30} color="#006400" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.description}>Email, phone number, social media</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="star-outline" size={30} color="#006400" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Feedback</Text>
            <Text style={styles.description}>App ratings, user experience</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="information-circle-outline" size={30} color="#006400" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>App Information</Text>
            <Text style={styles.description}>Version, updates</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="document-outline" size={30} color="#006400" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Legal Information</Text>
            <Text style={styles.description}>Privacy Policy, Terms of service</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:60
  },
  // header: {
  //   backgroundColor: '#1D7801',
  //   height: 60,
  //   color: 'black',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   paddingHorizontal: 20,
  // },


  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1D7801',
  },
  headerText: {
    color: '#1D7801',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    backgroundColor: '#EFFAF3',
    borderRadius: 10,
    padding: 25,
    borderWidth: 1,
    borderColor: '#EFFAF3',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  textContainer: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
  },
  description: {
    color: 'grey',
  },
});

export default HelpScreen;
