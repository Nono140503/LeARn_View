import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BarChart } from "react-native-chart-kit";

// Get screen width from dimensions
const screenWidth = Dimensions.get('window').width;

function ClassPerformance({ navigation }) {
    const handleBack = () => {
        navigation.goBack();
    };

    const data = {
        labels: ["Quiz 1", "Quiz 2", "Test 1", "Quiz 3", "Test 2"],
        datasets: [
            {
                data: [74, 81, 60, 84, 69],
            },
        ],
        legend: ["Average Marks (Week)"], // Legend added here
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.icon_cont} onPress={handleBack}>
                        <Icon name="arrow-back-outline" size={30} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Class Performance</Text>
                </View>
                <Text>Class average for the week:</Text>

                <BarChart
                    data={data}
                    width={screenWidth * 0.9}  
                    height={220}
                    yAxisLabel=""
                    fromZero={true}  // Ensure the y-axis starts from zero
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        paddingLeft: 15,  // Move y-axis closer to the edge
                        barPercentage: 0.9,  // Adjust bar width for padding
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        
                    }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: '8%',
        color: '#227d39',
        marginLeft: 20,
    },
    icon_cont: {
        padding: '5%',
    },
    icon: {
        top: "55%",
        color: "#227d39",
    },
    header: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        width: '100%',
    },
});

export default ClassPerformance;
