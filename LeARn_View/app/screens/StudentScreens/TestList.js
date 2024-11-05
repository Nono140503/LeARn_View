import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, where, onSnapshot, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const TestList = ({ navigation }) => {
    const [tests, setTests] = useState([]);
    const [attemptsData, setAttemptsData] = useState({});
    const studentId = auth.currentUser .uid;

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const testsCollection = collection(db, 'tests');
                const testSnapshot = await getDocs(testsCollection);
                
                const testList = testSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const unlockDate = new Date(data.unlockDate.seconds * 1000); // Convert Firestore timestamp to Date
                    const dueDate = new Date(data.dueDate.seconds * 1000);

                    // Combine unlockDate and unlockTime
                    const fullUnlockDate = new Date(
                        unlockDate.getFullYear(),
                        unlockDate.getMonth(),
                        unlockDate.getDate(),
                        parseInt(data.unlockTime?.hours || "0"),
                        parseInt(data.unlockTime?.minutes || "0")
                    );

                    // Combine dueDate and dueTime
                    const fullDueDate = new Date(
                        dueDate.getFullYear(),
                        dueDate.getMonth(),
                        dueDate.getDate(),
                        parseInt(data.dueTime?.hours || "0"),
                        parseInt(data.dueTime?.minutes || "0")
                    );

                    const currentTime = new Date();
                    const isTestAvailable = currentTime >= fullUnlockDate && currentTime <= fullDueDate;

                    return {
                        id: doc.id,
                        title: data.title,
                        duration: data.duration,
                        unlockDate: fullUnlockDate,
                        dueDate: fullDueDate,
                        questions: data.questions,
                        isTestAvailable // Add availability status
                    };
                });

                setTests(testList);
            } catch (error) {
                console.error("Error fetching tests:", error);
                Alert.alert('Error', 'Could not retrieve tests. Please try again later.');
            }
        };

        fetchTests();

        // Set up a listener for attempts data
        const attemptsQuery = query(collection(db, 'testAttempts'), where('studentId', '==', studentId));
        const unsubscribe = onSnapshot(attemptsQuery, (snapshot) => {
            const attempts = {};
            snapshot.docs.forEach(doc => {
                attempts[doc.data().testId] = doc.data().attempts;
            });
            setAttemptsData(attempts);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const recordAttempt = async (testId) => {
        const quizAttemptsRef = doc(db, 'testAttempts', `${testId}_${studentId}`);
        const docSnapshot = await getDoc(quizAttemptsRef);

        try {
            if (docSnapshot.exists()) {
                const attemptsData = docSnapshot.data();
                await updateDoc(quizAttemptsRef, { attempts: [...attemptsData.attempts, new Date()] });
            } else {
                await setDoc(quizAttemptsRef, { testId, studentId, attempts: [new Date()] });
            }
        } catch (error) {
            console.error("Error recording attempt:", error);
            Alert.alert('Error', 'Could not record your attempt. Please try again later.');
        }
    };

    const handleTestPress = async (test) => {
        const attempts = attemptsData[test.id] || [];
        if (attempts.length >= 1) {
            Alert.alert('Attempt exhausted', 'You have already taken this test.');
        } else {
            await recordAttempt(test.id); // Record the attempt before navigating
            navigation.navigate('Test Details', { 
                test: {
                    ...test,
                    unlockDate: test.unlockDate.toISOString(),
                    dueDate: test.dueDate.toISOString()
                } });
        }
    };

    const renderItem = ({ item }) => {
        const attempts = attemptsData[item.id] || [];
        const attemptsLeft = 1 - attempts.length; // Only 1 attempt allowed

        return (
            <View style={styles.testContainer}>
 <Text style={styles.testTitle}>{item.title}</Text>
                <Text style={styles.testInfo}>Duration: {item.duration}</Text>
                <Text style={styles.testInfo}>Unlock Date: {item.unlockDate.toLocaleString()}</Text>
                <Text style={styles.testInfo}>Due Date: {item.dueDate.toLocaleString()}</Text>
                <Text style={styles.testInfo}>Attempts left: {attemptsLeft}</Text>
                <Button
                    title={item.isTestAvailable && attemptsLeft > 0 ? "Take Test" : "Not Available"}
                    onPress={() => item.isTestAvailable && handleTestPress(item)}
                    disabled={!item.isTestAvailable || attemptsLeft === 0}
                    color={item.isTestAvailable && attemptsLeft > 0 ? "#4CAF50" : "#D32F2F"} // Green for available, red for not available
                />
            </View >
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Tests</Text>
            <FlatList
                data={tests}
                renderItem={renderItem}
                keyExtractor={ item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F7F7F7', // Light gray background
    },
    header: {
        paddingTop:30,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4CAF50', // Green header
        textAlign: 'center',
    },
    testContainer: {
        padding: 20,
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: '#FFFFFF', // White background for tests
        shadowColor: '#000', // Shadow for modern look
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    testTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50', // Green title
    },
    testInfo: {
        fontSize: 16,
        marginVertical: 4,
        color: '#666666', // Dark gray info
    },
    button: {
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50', // Green button background
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonDisabled: {
        backgroundColor: '#D32F2F', // Red for disabled button
    },
    buttonText: {
        color: '#FFFFFF', // White text for buttons
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
export default TestList;