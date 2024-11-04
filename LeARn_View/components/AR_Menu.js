import React, { useState } from "react";
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import  Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

function ARMenu() {
    const redirect = async (nav) =>{
        const supported = await Linking.canOpenURL(nav);
        if (supported){
            await Linking.openURL(nav);
        }else{
            Alert.alert("error", "Unable to open app");
        }

    }

    const navigation = useNavigation();
    const [list, setList] = useState([
        {
            title: 'Module 1',
            description: 'Taking A Computer Apart and Putting It Back Together',
            image: require('../assets/Computer.jpeg'),
            progress: 'Progress: 0%',
            icon: '', 
            nav: 'https://player.onirix.com/exp/ew0mm4', 
            
        },
        {
            title: 'Module 2',
            description: 'All About Motherboards\n',
            image: require('../assets/Motherboard.jpeg'),
            progress: 'Locked',
            icon: 'lock-closed-outline',
            nav: 'https://anchor.arway.ai/map/d9553071-f805-434e-a700-91e58381c239',  
        },
        {
            title: 'Module 3',
            description: 'Supporting Processors and Upgrading Memory',
            image: require('../assets/CPU.jpeg'),
            progress: 'Locked',
            icon: 'lock-closed-outline',
            nav: 'AR Environment Screen', 
        },
    ]);

    return (
        <>
            <FlatList
                style={styles.listCont}
                data={list}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            if (item?.nav) {
                                // Navigate to the WebViewScreen and pass the URL
                                navigation.navigate('WebView Screen', { uri: item.nav });
                            } else {
                                console.warn('Invalid navigation route');
                            }
                        }}
                    >
                        <ImageBackground
                            source={item.image}
                            style={styles.img}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <View style={styles.progress_cont}>
                                    <Text style={styles.progress}>{item.progress}</Text>
                                    <Icon name={item.icon} size={25} style={styles.icon} />
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 15 }}
            />
            <View style={styles.space}>
                <Text></Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        margin: 8,
        padding: 5,
        gap: 10,
        alignItems: "center",
    },
    description: {
        color: 'white',
        marginTop: 14,
        fontSize: 17,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    icon:{
        color: 'white',
        marginLeft: 10,
    },
    listCont: {
        marginTop: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
        padding: 15,
    },
    img: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        marginTop: '5%',
    },
    space: {
        height: 50,
    },
    progress_cont:{
        display: 'flex',
        flexDirection: 'row',

        marginTop: 35,
    },
    progress:{
        color:'white',
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 210,
    },
});

export default ARMenu;
