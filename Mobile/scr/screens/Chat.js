import React, {useEffect, useState, useCallback} from "react";
import {View, Text, StyleSheet} from "react-native";
import IO from "socket.io-client";

import { mediaDevices, RTCView } from 'react-native-webrtc';

import Peer from 'react-native-peerjs';

// const URL = 'http://172.28.76.96:6000';
const URL = 'http://joeyke.ru:14050';

export const Chat = ({ route }) => {
    const [myStream, setMyStream] = useState(null);
    const [partnerStream, setPartnerStream] = useState(null);

    const { roomId } = route.params;

    const joinRoom = useCallback((stream) => {

        const connectToNewUser = (userId, stream) => {
            const call = peerServer.call(userId, stream);
            call.on('stream', (remoteVideoStream) => {
                if (remoteVideoStream) {
                    setPartnerStream(remoteVideoStream)
                }
            })
        }

        const socket = IO(`${URL}`, {
            forceNew: true
        });

        const peerServer = new Peer(undefined, {
            host: 'joeyke.ru',
            secure: false,
            port: 14050,
            path: '/mypeer'
        });

        peerServer.on('error', console.log);

        setMyStream(stream);

        peerServer.on('open', (userId) => {
            socket.emit('join-room', { userId, roomId });
            console.log('join-room: ', userId, roomId);
        })

        peerServer.on('call', (call) => {
            call.answer(stream);

            call.on('stream', (stream) => {
                setPartnerStream(stream);
            })
        })

        socket.on('user-connected', (userId) => {
            connectToNewUser(userId, stream);
        })
    }, []);

    useEffect(() => {
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 640,
                    height: 480,
                    frameRate: 30,
                    facingMode: (isFront ? "user" : "environment"),
                    deviceId: videoSourceId
                }
            }, [])
                .then(stream => {
                    joinRoom(stream);
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.baseText}>Your room id:
                <Text style={{color: 'red'}}> {roomId} </Text>
            </Text>
            {myStream && <View style={styles.streamView}>
                <RTCView style={{
                    height: 300,
                    width: 350
                }} streamURL={myStream.toURL()}/>
            </View>}
            {partnerStream && <View style={styles.streamView}>
                <RTCView style={{
                    height: 300,
                    width: 350
                }} streamURL={partnerStream.toURL()}/>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },

    streamView: {
        height: 330,
        borderColor: "grey",
        borderWidth: 7,
    },

    baseText: {
      fontSize: 18,
      color: 'black'
    }
})
