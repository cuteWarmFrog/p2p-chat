import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import IO from "socket.io-client";

import { mediaDevices, RTCView } from 'react-native-webrtc';

import Peer from 'react-native-peerjs';

const URL = 'http://192.168.31.188:6000';

export const Chat = ({ route }) => {
    const [myStream, setMyStream] = useState(null);
    const [partnerStream, setPartnerStream] = useState(null);

    const { roomId } = route.params;

    const joinRoom = (stream) => {

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
            host: '192.168.31.188',
            secure: false,
            // port: 6000,
            path: '/mypeer'
        });

        peerServer.on('error', console.log);

        setMyStream(stream);

        peerServer.on('open', (userId) => {
            socket.emit('join-room', { userId, roomId })
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
    }

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
            <Text>{roomId} здесь будут ебать кабана</Text>
            {myStream && <View style={styles.streamView}>
                <RTCView style={{
                    height: 250,
                    width: 250
                }} streamURL={myStream.toURL()}/>
            </View>}
            {partnerStream && <View style={styles.streamView}>
                <RTCView style={{
                    height: 250,
                    width: 250
                }} streamURL={partnerStream.toURL()}/>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },

    streamView: {
        height: 280,
        borderColor: "yellow",
        borderWidth: 4
    }
})