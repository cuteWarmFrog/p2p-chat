import React, {useEffect, useState} from 'react';
import { Text, View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {PrimaryButton, SecondaryButton} from "../components/Themed";
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { URL } from '../utils/urls';
import {getFcmToken} from "../utils/firebase";

const BLUE = "#007AFF";
const BLACK = "#000000";
const LENGTH = 4; // Length of the Room ID

export const Home = () => {
    const navigation = useNavigation();
    const [roomId, setRoomId] = useState('');
    const [login, setLogin] = useState('');
    const [loginInput, setLoginInput] = useState('');
    const [token, setToken] = useState('');
    const [toCall, setToCall] = useState('');

    useEffect(() => {
        (() =>getFcmToken().then(token => {
            setToken(token)
        }))();
    }, [])

    useEffect(() => {
        ( async () => {
            const log = await AsyncStorage.getItem('login');
            if(log) {
                console.log(log);
                setLogin(log);
            }
        })()
    }, [])

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        return unsubscribe;
    }, []);

    const [lastConnectedRoom, setLastConnectedRoom] = useState(null);

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
            navigation.navigate('Chat', { roomId, login, setLastConnectedRoom });
        }
    }

    const handleCreateSubmit = () => {
        const roomId = generateID();
        setRoomId(roomId);
        navigation.navigate('Chat', { roomId, login, setLastConnectedRoom});
    }

    const callCreateRoom = (roomId) => {
        setRoomId(roomId);
        navigation.navigate('Chat', { roomId, login, setLastConnectedRoom});
    }

    const handleReconnect = () => {
        // Reconnect to room, using saved id
        navigation.navigate('Chat', {roomId: lastConnectedRoom, login, setLastConnectedRoom} )
    }

    const handleLogin = async () => {
        const token = await getFcmToken();
        console.log('login:', login);
        console.log('token:', token);
        try {
            const response = await axios(`${URL}/login`, { params: {userLogin: login, token }});
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const checkLogin = () => {
        console.log(loginInput);
        axios.get(`${URL}/login`, { params: { userLogin: loginInput, token: token}})
            .then(response => {
                if(response.data === 'Success login in Base!') {
                    AsyncStorage.setItem('login', loginInput);
                    setLogin(loginInput);
                } else {
                    setLogin(response.data);
                }
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const call = () => {
        axios.get(`${URL}/login`, { params: { userLogin: toCall}})
            .then(response => {
                if(response.data === 'Login is taken!') {
                    const roomId = generateID();
                    axios.get(`${URL}/call`, { params: { partnerLogin: toCall, login, roomId }})
                        .then(response => {
                            callCreateRoom(roomId);
                        })

                }
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your login: {login}</Text>
            {login === '' && <>
                <TextInput
                    placeholder="Username"
                    onChangeText={(text) => setLoginInput(text)}
                    style={styles.textInput}
                />
                <SecondaryButton title='Login' onPress={checkLogin}/>
            </>}
            <TextInput
                placeholder="to call"
                onChangeText={(text) => setToCall(text)}
                style={ styles.textInput }
            />
            <SecondaryButton title='Call' onPress={ call} />

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

            {lastConnectedRoom && <View style={styles.buttonsWrapper}>
                    <SecondaryButton  title='Reconnect' onPress={ handleReconnect } />
                </View>}
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
        width: '80%',
        marginVertical: 10
    }
});
