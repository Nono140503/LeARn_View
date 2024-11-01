import React, { cloneElement, useContext } from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import  Icon from 'react-native-vector-icons/Ionicons';
import themeContext from './ThemeContext';

function ProgressHeader({navigation}){
    const handleBack = ()=>{
        navigation.goBack();
    }

    const theme = useContext(themeContext)

    return (
        <>
        <View style={[styles.header, {backgroundColor: theme.backgroundColor}]}>
                <TouchableOpacity onPress={handleBack} style={styles.icon_cont}>
            
            <Icon name='arrow-back-outline' size={30} style={styles.icon}  onPress={handleBack}/>
                </TouchableOpacity>
                <Text style={styles.title}>Progress</Text>
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
        marginRight: 120,
    },
    icon_cont:{
        padding: '5%'
    },
    icon:{
        top:"30%",
        color:"#227d39",
    },
    header: {
        
        
        alignItems: 'center',
        padding: '2%',
        backgroundColor: '#EFFAF3', 
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
export default ProgressHeader