import React, { cloneElement } from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import  Icon from 'react-native-vector-icons/Ionicons';

function CheckYourKnowledgeHeader({navigation}){
    const handleBack = ()=>{
        navigation.navigate('Home Screen');
    }
    return (
        <>
        <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.icon_cont}>
            
            <Icon name='menu-outline' size={30} style={styles.icon}  onPress={handleBack}/>
                </TouchableOpacity>
                <Text style={styles.title}>Lecturer Dashboard</Text>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: '8%',
        color: '#227d39',
        marginRight: 70,
    },
    icon_cont:{
        padding: '5%'
    },
    icon:{
        top:"30%",
        color:"#227d39",
    },
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
        marginBottom: 10,
    },
    logo:{
        width: 70,
        height: 70,
        borderRadius: '50%',
    },
})
export default CheckYourKnowledgeHeader