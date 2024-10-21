import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase'; 
import { getAuth } from 'firebase/auth'; 

const HomeScreen = () => {
    const navigation = useNavigation(); 
    const [unreadCount, setUnreadCount] = useState(0);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            // Query announcements where the user's ID is NOT in the readBy array (i.e., unread)
            const q = query(
                collection(db, 'announcements'),
                where('readBy', 'array-contains', user.uid) // Get all announcements read by the user
            );

            // Track unread announcements (not in 'readBy' array)
            const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
                const unreadAnnouncements = snapshot.docs.filter(doc => !doc.data().readBy.includes(user.uid));
                setUnreadCount(unreadAnnouncements.length); // Set unread count
            });

            return () => unsubscribe(); // Cleanup listener
        }
    }, [user]);

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')} style={styles.icon_cont}>
                <View>
                    <Icon name='notifications' size={30} style={styles.icon} />
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            <Text style={styles.title}>Home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        borderBottomColor: 'grey',
        borderBottomWidth: 0.4,
        alignItems: 'center',
        padding: '2%',
        backgroundColor: '#fff', 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    title: {
        fontWeight: 'bold',
        marginTop: '8%',
        color: '#227d39',
        marginRight: '45%'
    },
    icon_cont: {
        padding: '5%', 
    },
    icon: {
        color: "#227d39",
        top: "50%",
    },
    unreadBadge: {
        position: 'absolute',
        right: -5,
        top: 15,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
