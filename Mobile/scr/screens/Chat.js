import React, {useEffect, useState, useCallback} from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import IO from "socket.io-client";
import {VideoChat} from '../components/VideoChat';

import { mediaDevices } from 'react-native-webrtc';

import InCallManager from 'react-native-incall-manager';
import Peer from 'react-native-peerjs';

// const URL = 'http://172.28.76.96:6000';
const URL = 'http://joeyke.ru:14050';

export const Chat = ({ route }) => {
    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [showControlButtons, setShowControlButtons] = useState(false);

    const { roomId } = route.params;

    const joinRoom = useCallback((stream) => {

        const connectToNewUser = (userId, stream) => {
            const call = peerServer.call(userId, stream);
            call.on('stream', (remoteVideoStream) => {
                if (remoteVideoStream) {
                    setRemoteStreams((remoteStreams) => remoteStreams.concat(remoteVideoStream))
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
            InCallManager.start({media: 'video'}); //runtime call manager
            call.on('stream', (stream) => {
                setRemoteStreams((remoteStreams) => remoteStreams.concat(stream));
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

    const speakerphoneHandler = () => {
        InCallManager.setForceSpeakerphoneOn(true);
        //InCallManager.startRingtone('DEFAULT');
    }

    const onBodyClick = () => {
        setShowControlButtons(true);
        setTimeout(() => {
            setShowControlButtons(false);
        }, 2500)
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onBodyClick}
            style={{flex: 1}}>
                <VideoChat
                    myStream={myStream}
                    // remoteStreams={[myStream]}
                    remoteStreams={[...remoteStreams]}
                    roomId={roomId}
                    showControlButtons={showControlButtons}
                />
        </TouchableOpacity>
    )
}

