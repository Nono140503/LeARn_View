import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { ProgressChart, LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import ProgressHeader from '../../../components/ProgressHeader';
import themeContext from '../../../components/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const Progress = ({ route, navigation }) => {
    const { student } = route.params;
    const theme = useContext(themeContext)

    const totalItems = [8, 5, 3];
    const barData = {
        labels: ["Quiz Average", "Test Average", "AR Average"],
        datasets: [
            {
                data: student.gradeOverview,
            },
        ],
        legend: ["Average Marks (Week)"], 
    };


    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.backgroundColor}]} contentContainerStyle={{ paddingBottom: 100 }}>
            <ProgressHeader navigation={navigation} />
            <View style={[styles.header, {backgroundColor: theme.backgroundColor}]}>
                <Image source={student.image} style={styles.studentImage} />
                <View>
                    <Text style={styles.studentName}>Name: {`${student.name} ${student.surname}`}</Text>
                    <Text style={styles.studentGrade}>Student Number: {student.student_number}</Text>
                    <Text style={styles.studentYear}>Year: {student.year}</Text>
                    <Text style={styles.studentYear}>Course: {student.course}</Text>
                </View>
            </View>

            <Text style={styles.title}>Progress Overview</Text>
            <View style={styles.progressContainer}>
                {student.progress.map((data, index) => {
                    const completed = Math.round(data * totalItems[index]);
                    const total = totalItems[index];
                    const percentage = ((completed / total) * 100).toFixed(0);
                    const label = index === 0 ? `Quizzes: ${completed} out of ${total} (${percentage}%)`
                        : index === 1 ? `AR Lessons: ${completed} out of ${total} (${percentage}%)`
                        : `Tests: ${completed} out of ${total} (${percentage}%)`;

                    return (
                        <View key={index} style={styles.progressChart}>
                            {index == 0 &&   <Text style={styles.chartHeading}>Quizzes (Complete %)</Text>}
                            {index === 1 && <Text style={styles.chartHeading}>AR Lessons (Complete %)</Text>}
                            {index === 2 && <Text style={styles.chartHeading}>Tests (Complete %)</Text>}
                            <ProgressChart
                                data={{
                                    data: [data],
                                }}
                                width={screenWidth * 0.85} 
                                height={140}  
                                strokeWidth={20}
                                radius={32}
                                chartConfig={{
                                    backgroundColor: "#3D8DCB",
                                    backgroundGradientFrom: "white",
                                    backgroundGradientTo: "white",
                                    color: (opacity = 1) => {
                                        switch (index) {
                                            case 0:
                                                return `rgba(29, 182, 238, ${opacity})`;
                                            case 1:
                                                return `rgba(85, 12, 221, ${opacity})`;
                                            case 2:
                                                return `rgba(233, 111, 0, ${opacity})`;
                                            default:
                                                return `rgba(0, 0, 0, ${opacity})`;
                                        }
                                    },
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                                style={{ marginVertical: 10, borderRadius: 5 }}
                            />
                        </View>
                    );
                })}
            </View>

            <Text style={styles.title}>Performance History</Text>
            <LineChart
                data={{
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Test 1'],
                    datasets: [
                        {
                            data: student.performanceHistory,
                        },
                    ],
                }}
                width={screenWidth * 0.85}  
                height={220}
                yAxisLabel=""
                fromZero={true}
                chartConfig={{
                    backgroundColor: "#3D8DCB",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 10,
                    borderRadius: 16,
                }}
            />

            <Text style={styles.title}>Engagement Level</Text>
            <Text style={styles.time}>Time Spent (%)</Text>
            <PieChart
                data={student.engagementLevel.map(item => ({
                    name: item.name,
                    population: item.population,
                    color: item.name === 'Quizzes' ? '#24AABB'
                        : item.name === 'AR Lessons' ? '#FFCC00'
                        : item.name === 'Idle/Non Engagement' ? '#3523C4'
                        : '#F44336',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 10,
                }))}
                width={350}  
                height={200}  
                chartConfig={{
                    backgroundColor: "#3D8DCB",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        width: '100%',
                        marginRight: 20,
                    },
                }}
                accessor="population"
                backgroundColor="transparent"
                absolute
            />

            <Text style={styles.title}>Grade Breakdown</Text>
            <BarChart
                    data={barData}
                    width={380}  
                    height={220}
                    fromZero={true}  
                    chartConfig={{
                        backgroundColor: "#3D8DCB",
                        backgroundGradientFrom: "#EFFAF3",
                        backgroundGradientTo: "#EFFAF3",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(4, 145, 44, ${opacity})`,
                        labelColor: (opacity = 1) => `black`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 1.2,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFFAF3',
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    studentImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        
    },
    studentGrade: {
        fontSize: 16,
        color: 'gray',
    },
    studentYear: {
        fontSize: 16,
        color: 'gray',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#3C7BF2',
    },
    chartHeading: {
        fontSize: 16,
        marginVertical: 5,
        color: '#2C75FF',
    },
    progressContainer: {
        marginBottom: 20,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        width: '100%',
        marginLeft: 20,
    },
    progressChart: {
        marginBottom: 20,
    },
    time: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default Progress;
