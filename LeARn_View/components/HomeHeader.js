import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
    const navigation = useNavigation(); 

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')} style={styles.icon_cont}>
                <Icon name='notifications' size={30} style={styles.icon} />
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
        top:"50%",
    },
});

export default HomeScreen;
