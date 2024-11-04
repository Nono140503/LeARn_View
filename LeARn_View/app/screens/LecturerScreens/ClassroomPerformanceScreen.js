import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BarChart, LineChart } from "react-native-chart-kit";
import themeContext from '../../../components/ThemeContext';

// Get screen width from dimensions
const screenWidth = Dimensions.get('window').width;

function ClassPerformance({ navigation }) {
    const handleBack = () => {
        navigation.goBack();
    };

    const theme = useContext(themeContext)

    // Data for the bar chart
    const barData = {
        labels: ["Quiz 1", "Quiz 2", "Test 1", "Quiz 3", "Test 2"],
        datasets: [
            {
                data: [74, 81, 60, 84, 69],
            },
        ],
        legend: ["Average Marks (Week)"], // Legend added here
    };

    // Data for the line chart
    const lineData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                data: [50, 60, 57, 79], 
                strokeWidth: 2, 
            },
        ],
    };

    return (
        <>
            <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
                <View style={[styles.header, {backgroundColor: theme.backgroundColor}]}>
                    <TouchableOpacity style={styles.icon_cont} onPress={handleBack}>
                        <Icon name="arrow-back-outline" size={30} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Class Performance</Text>
                </View>
                <Text style={[styles.heading, {color: theme.color}]}>Class average for the week:</Text>

                <BarChart
                    data={barData}
                    width={screenWidth * 0.9}  
                    height={220}
                    fromZero={true}  
                    chartConfig={{
                        backgroundColor: "#3D8DCB",
                        backgroundGradientFrom: "white",
                        backgroundGradientTo: "white",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(14, 109, 181, ${opacity})`,
                        labelColor: (opacity = 1) => `black`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.9,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
                
                <Text style={[styles.heading, {color: theme.color}]}>Monthly Performance Summary</Text>
                <LineChart
                    data={lineData}
                    width={screenWidth * 0.9}
                    height={220}
                    withDots={true}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    fromZero={true} 
                    chartConfig={{
                        backgroundColor: "#3D8DCB",
                        backgroundGradientFrom: "white",
                        backgroundGradientTo: "white",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(85, 12, 221, ${opacity})`,
                        labelColor: (opacity = 1) => `black`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
                <Text style={[styles.heading, {color: theme.color}]}>Your top student for the month is:</Text>
                <View style={styles.top_student}>
                    <View style={styles.image_cont}>
                        <Image source={require('../../../assets/Layla.jpeg')} style={styles.image}/>
                        <Icon name='trophy' size={30} style={styles.trophy}/>
                    </View>
                    <View>
                        <Text style={styles.top_student_name}>Layla Smith </Text>
                        
                        <Text style={styles.top_student_year}>First year student BIT</Text>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    image_cont:{
        flexDirection: 'row',
    },
    trophy:{
        width: 50,
        height: 50,
        color: 'gold',
        shadowColor: 'rgba(0, 0, 0, 0.5)', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, 
        shadowRadius: 1.5,
        top: 45,
        right: 25,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: '8%',
        color: '#227d39',
        marginLeft: 20,
    },
    top_student_name:{
        color: 'green',
        marginTop: 10,
        fontSize: 15,
        fontWeight: 'bold',
        right: 20
    },
    top_student_year:{
        fontSize: 15,
        color: 'green',
        right: 20,
    },
    image:{
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    top_student:{
        flexDirection: 'row',
        backgroundColor: '#EFFAF3',
        borderRadius: 10,
        padding: 15,
        width:'90%',
        marginLeft: 20,
        marginBottom: 15,
        marginTop: 10,
        borderWidth: 1,
        elevation: 5,
        borderColor: '#EFFAF3',
        shadowColor: 'rgba(0, 0, 0, 0.5)', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, 
        shadowRadius: 3.5,
        justifyContent: 'space-around'
    },
    heading: {
        fontSize: 15,
        // color: '#3D8DCB',
        marginLeft: 15,
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
