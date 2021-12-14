import React, { useState } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {PrimaryButton, SecondaryButton} from "../components/Themed";


const BLUE = "#007AFF";
const BLACK = "#000000";
const LENGTH = 6; // Length of the Room ID

export const Home = () => {
    const navigation = useNavigation();
    const [roomId, setRoomId] = useState('');

    // Generating random room id for the initiating peer
    const generateID = () => {
        let result = '';
        const characters = 'abcdefghjkmnpqrstuvwxyz123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleSubmit = () => {
        if (roomId !== '') {
            // Enter the room
            navigation.navigate('Chat', { roomId });
        }
    }

    const handleCreateSubmit = () => {
        // Make a new room ID
        const roomId = generateID();
        console.log(roomId); // Share this room id to another peer in order to join in the same room
        setRoomId(roomId);
        navigation.navigate('Chat', { roomId });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>You're looking beautiful today!</Text>
            <Text style={styles.subtitle}>Make a room!</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <TextInput
                placeholder="Enter Room ID"
                onChangeText={ (text) => setRoomId(text)}
                style={ styles.textInput }
            />

            <View style={styles.buttonsWrapper}>
                <SecondaryButton title='Join Room' onPress={ handleSubmit } />
                <PrimaryButton title='Make Room' onPress={ handleCreateSubmit } />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'normal',
        opacity: 0.8
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    textInput: {
        width: '70%',
        paddingVertical: 3,
        paddingHorizontal: 40,
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 40,
        borderBottomWidth: 1,
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%'
    }
});