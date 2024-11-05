import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const WebViewScreen = ({ route }) => {
    const { uri } = route.params;
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(false); 

    useEffect(() => {
        const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        };

        requestCameraPermission();
    }, []);

    if (hasCameraPermission === false) {
        Alert.alert("Camera Permission Required", "Camera access is required for this feature.");
    }

    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            )}

            
            <WebView
                source={{ uri }}
                onLoadStart={() => setLoading(true)} 
                onLoadEnd={() => setLoading(false)} 
                onHttpError={() => {
                    setError(true); 
                    setLoading(false); 
                    Alert.alert("Error", "Unable to load the page.");
                }}
                onError={() => {
                    setError(true); 
                    setLoading(false); 
                    Alert.alert("Error", "Something went wrong while loading the page.");
                }}
                style={styles.webview}
                javaScriptEnabled={true} 
                mediaPlaybackRequiresUserAction={false} 
                allowsInlineMediaPlayback={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -25,
        marginTop: -25,
    },
    webview: {
        flex: 1,
        opacity: 1,
    },
});

export default WebViewScreen;
