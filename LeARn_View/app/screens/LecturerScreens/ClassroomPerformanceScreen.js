import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BarChart } from "react-native-chart-kit";
import themeContext from "../../../components/ThemeContext";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

const ClassPerformance = ({ navigation }) => {
  const [quizScores, setQuizScores] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const theme = useContext(themeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoreRanges = [
          { label: "1-10", min: 1, max: 10, count: 0 },
          { label: "11-20", min: 11, max: 20, count: 0 },
          { label: "21-30", min: 21, max: 30, count: 0 },
        ];
        const testRanges = [
          { label: "1-10", min: 1, max: 10, count: 0 },
          { label: "11-20", min: 11, max: 20, count: 0 },
          { label: "21-30", min: 21, max: 30, count: 0 },
        ];

        const quizSnapshot = await getDocs(collection(db, "quizScores"));
        const quizData = [];
        quizSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            quizData.push(data);
          }
        });

        Object.values(quizData[0]).forEach((entry) => {
          const score = entry.score;
          scoreRanges.forEach((range) => {
            if (score >= range.min && score <= range.max) {
              range.count += 1;
            }
          });
        });

        setQuizScores(scoreRanges);

        const testSnapshot = await getDocs(collection(db, "testMarks"));
        const testData = [];
        testSnapshot.forEach((doc) => {
          const data = doc.data();
          testData.push(data);
        });

        Object.values(testData).forEach((entry) => {
          const score = entry.score;
          testRanges.forEach((range) => {
            if (score >= range.min && score <= range.max) {
              range.count += 1;
            }
          });
        });

        setTestScores(testRanges);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleBack}>
          <Icon name="arrow-back-outline" size={30} style={styles.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.color }]}>
          Class Performance
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.color }]}>
          Quiz Scores
        </Text>
        <BarChart
          data={{
            labels: quizScores.map((range) => range.label),
            datasets: [{ data: quizScores.map((range) => range.count) }],
          }}
          width={screenWidth * 0.9}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: "#3D8DCB",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(14, 109, 181, ${opacity})`,
            labelColor: () => "black",
            barPercentage: 0.9,
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.color }]}>
          Test Scores
        </Text>
        <BarChart
          data={{
            labels: testScores.map((range) => range.label),
            datasets: [{ data: testScores.map((range) => range.count) }],
          }}
          width={screenWidth * 0.9}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: "#3D8DCB",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(14, 109, 181, ${opacity})`,
            labelColor: () => "black",
            barPercentage: 0.9,
          }}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    color: "#227d39",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#227d39",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#227d39",
  },
  section: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#227d39",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});

export default ClassPerformance;
