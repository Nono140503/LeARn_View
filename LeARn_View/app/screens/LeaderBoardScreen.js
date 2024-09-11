import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Button, ScrollView, SafeAreaView, Alert, Switch } from 'react-native'
import React, { useEffect, useState, createContext, useContext } from 'react'

export default function LeaderBoard() {
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>

                {/* 1st Place */}
                <View style={styles.firstRankContainer}>
                    <View style={styles.userDetails}>
                        <View style={styles.firstPlace}>
                            <Image source={''} style={styles.pfp}></Image>
                            <Text style={styles.firstRankText}>
                                Name: Layla Smith {'\n'}
                                SN: 224245790 {'\n'}
                                Score: 10/10 (100%)
                            </Text>
                            {/* Trophy Image */}
                            <Image source={''} style={styles.trophy}></Image>
                        </View>
                    </View>
                </View>


                {/* 2nd Place */}
                <View style={styles.secondRankContainer}>
                    <View style={styles.userDetails}>
                        <View style={styles.secondPlace}>
                            <Image source={''} style={styles.pfp}></Image>
                            <Text style={styles.rankText}>
                                Name: Kara Lexington {'\n'}
                                SN: 223892103  {'\n'}
                                Score: 9/10 (90%)
                            </Text>
                            <Text style={styles.rankPlacement}>#2</Text>
                        </View>
                    </View>
                </View>

                {/* 3rd Place */}
                <View style={styles.thirdRankContainer}>
                    <View style={styles.userDetails}>
                        <View style={styles.thirdPlace}>
                            <Image source={''} style={styles.pfp}></Image>
                            <Text style={styles.rankText}>
                                Name: Samuel Jackson {'\n'}
                                SN: 224782302 {'\n'}
                                Score: 9/10 (90%)
                            </Text>
                            <Text style={styles.rankPlacement}>#3</Text>
                        </View>
                    </View>
                </View>

                {/* Other Student Ranks */}
                <View style={styles.rankContainer}>
                    <View style={styles.userDetails}>
                        <View style={styles.rankPlace}>
                            <Image source={''} style={styles.pfp}></Image>
                            <Text style={styles.rankText}>
                                Name: Sean Paul {'\n'}
                                SN: 222653891 {'\n'}
                                Score: 7/10 (70%)
                            </Text>
                            <Text style={styles.rankPlacement}>#4</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.rankContainer}>
                    <View style={styles.userDetails}>
                        <View style={styles.rankPlace}>
                            <Image source={''} style={styles.pfp}></Image>
                            <Text style={styles.rankText}>
                                Name: Sarah Martinez {'\n'}
                                SN: 223907543 {'\n'}
                                Score: 6/10 (60%)
                            </Text>
                            <Text style={styles.rankPlacement}>#5</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
    },

    rankContainer: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'transparent',
        justifyContent: 'center',
        width: 300,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'column',
        backgroundColor: '#1D7801',
    },

    firstRankContainer: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'transparent',

        justifyContent: 'center',
        width: 300,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'column',
        backgroundColor: '#F7E060',
    },

    secondRankContainer: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'transparent',

        justifyContent: 'center',
        width: 300,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'column',
        backgroundColor: '#606060',
    },

    thirdRankContainer: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'transparent',

        justifyContent: 'center',
        width: 300,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'column',
        backgroundColor: '#B96B05',
    },

    // userDetails:{
    //     flexDirection: 'row',
    // },

    pfp: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 3,
    },

    rankText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 10,
        color: 'white',
    },

    firstRankText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 10,
        color: 'black',
    },

    trophy: {
        width: 50,
        height: 50,
        marginLeft: 50,
        borderRadius: 10,
    },

    rankPlacement: {
        marginLeft: 'auto',
        marginTop: 5,
        marginRight: 40,

        borderRadius: 10,
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },

    firstPlace: {
        flexDirection: 'row',
    },

    secondPlace: {
        flexDirection: 'row',
    },

    thirdPlace: {
        flexDirection: 'row',
    },

    rankPlace: {
        flexDirection: 'row',
    },
})