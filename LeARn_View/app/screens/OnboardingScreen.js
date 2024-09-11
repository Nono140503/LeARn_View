import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  const screens = [
    {
      title: 'AR Learning',
      description: 'Step into a new dimension of learning with Augmented Reality. Experience interactive lessons like never before!',
      icon: '📱',
    },
    {
      title: 'Personalized Learning',
      description: 'Your learning, your pace! Get tailored lessons designed just for you.',
      icon: '📚',
    },
    {
      title: 'Get Started!',
      description: "Ready to unlock interactive learning? Let's begin your AR education journey now!",
      icon: '▶️',
    },
  ];

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1);
      Animated.timing(translateX, {
        toValue: -(currentIndex + 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      Animated.timing(translateX, {
        toValue: -(currentIndex - 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSkip = () => {
    navigation.navigate('Sign Up');
  };

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
    useNativeDriver: true,
  });

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let newIndex = currentIndex;
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > width * 0.2) {
        newIndex = translationX > 0 ? Math.max(currentIndex - 1, 0) : Math.min(currentIndex + 1, screens.length - 1);
      }

      setCurrentIndex(newIndex);
      Animated.spring(translateX, {
        toValue: -newIndex * width,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Sign Up');
  };

  const getDotWidth = (index) => {
    return currentIndex === index ? 20 : 8;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.screensContainer, { transform: [{ translateX }] }]}>
          {screens.map((screen, index) => (
            <View key={index} style={styles.screen}>
              <Text style={styles.icon}>{screen.icon}</Text>
              <Text style={styles.title}>{screen.title}</Text>
              <Text style={styles.description}>{screen.description}</Text>
            </View>
          ))}
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.dotsContainer}>
        {screens.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: getDotWidth(index),
              },
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.navButton, { opacity: currentIndex === 0 ? 0 : 1 }]}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
        {currentIndex < screens.length - 1 ? (
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navButton, styles.getStartedButton]} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  skipButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screensContainer: {
    flexDirection: 'row',
    height: height,
  },
  screen: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#47694a',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  navigation: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 15,
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 25,
  },
  navButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  getStartedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
  },
  getStartedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
