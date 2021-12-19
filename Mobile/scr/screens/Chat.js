import React, {useEffect, useState, useCallback} from "react";
import { TouchableOpacity } from "react-native";
import IO from "socket.io-client";
import {VideoChat} from '../components/VideoChat';

import { mediaDevices } from 'react-native-webrtc';

import InCallManager from 'react-native-incall-manager';
import Peer from 'react-native-peerjs';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {useRoute} from '@react-navigation/native';
import {useForceUpdate} from "../hooks/useForceUpdate";

import { URL } from '../utils/urls';
import {getFcmToken} from "../utils/firebase";

export const Chat = ({ route }) => {
    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const [showControlButtons, setShowControlButtons] = useState(false);
    const [isCamera, setIsCamera] = useState(false);
    const [isMicro, setIsMicro] = useState(false);

    const [peer, setPeer] = useState(null);
    const forceUpdate = useForceUpdate();

    const [timeOutToCloseButtons, setTimeOutToCloseButtons] = useState(null);

    const popOnce = StackActions.pop(1);
    const navigation = useNavigation();
    const { roomId, login, setLastConnectedRoom:setLastConnectedRoom } = route.params;

    const joinRoom = useCallback((myStream) => {

        const connectToNewUser = (userId, stream) => {
            const call = peerServer.call(userId, stream);
            // creating call-room here
            // stream event again here
            call.on('stream', (remoteVideoStream) => {
                if (remoteVideoStream) {
                    setRemoteStreams((remoteStreams) => remoteStreams.concat(remoteVideoStream))
                }
            })
        }

        const localSocket = IO(`${URL}`, {
            forceNew: true
        });

        const peerServer = new Peer(undefined, {
            host: 'joeyke.ru',
            secure: false,
            port: 14050,
            path: '/mypeer'
        });

        setPeer(peerServer);

        peerServer.on('error', console.log);

        setMyStream(myStream);

        peerServer.on('open', async (userId) => {
            // sending signal to server, on which
            // it will answer with room-joining and that roomId
         
            const token = await getFcmToken();
            console.log(token);
            localSocket.emit('join-room', { userId, roomId });
            setLastConnectedRoom(roomId);
            console.log('join-room: ', userId, roomId);
        })

        peerServer.on('call', (call) => {
            call.answer(myStream);
            // answering call here, and then subscribing to
            // 'stream' event that will trigger new participants screens rendering
            InCallManager.start({media: 'video'}); //runtime call manager
            call.on('stream', (stream) => {
                setRemoteStreams((remoteStreams) => remoteStreams.concat(stream));
            })
        })
        localSocket.on('user-connected', (userId) => {
            // after server transfer user id, try to connect to
            // new room
            console.log('in uc');
            connectToNewUser(userId, myStream);
        })

    }, []);

    useEffect(() => {
        // background daemon to keep connection alive
        // after disconnect
        async function startForegroundService() {

            const channelConfig = {
                id: 'channelId',
                name: 'Messenger notifications',
                description: 'Channel description',
                enableVibration: false
            };

            const notificationConfig = {
                channelId: 'channelId',
                id: 3456,
                title: 'P2P messenger',
                text: 'App is running in background',
                icon: 'ic_icon'
            };
            try {
                await VIForegroundService.createNotificationChannel(channelConfig);
                await VIForegroundService.startService(notificationConfig);
            } catch (e) {
                console.error(e);
            }
        }

        startForegroundService().then(r => {console.log('back service is running')});

        console.log('in useEffect');

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if(sourceInfo.kind === "videoinput" && sourceInfo.facing === (isFront ? "front" : "environment")) {
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
                    // simulcast implementation, setting codecs for different connection
                    // quality
                    sendEncodings: [
                        { rid: "h", maxBitrate: 1200 * 1024 },
                        { rid: "m", maxBitrate:  600 * 1024, scaleResolutionDownBy: 2 },
                        { rid: "l", maxBitrate:  300 * 1024, scaleResolutionDownBy: 4 }
                    ],
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


     const toggleMicro = () => {
       myStream.getAudioTracks()[0].enabled=isMicro;
       setIsMicro(!isMicro);
    }

    const toggleCamera = () => {
        myStream.getVideoTracks()[0].enabled = isCamera;
        setIsCamera(!isCamera);
    }

    const switchCameraView = () => {
        myStream.getVideoTracks().forEach( (track) => {
            track._switchCamera();
        })
        forceUpdate();
    }


    const onBodyClick = () => {
        setShowControlButtons(!showControlButtons)
    }

    const endCall = () => {
        setLastConnectedRoom(null);
        myStream.getTracks().forEach(t => t.stop());
        remoteStreams.forEach(tr => tr.getTracks().forEach(t => t.stop()));
        remoteStreams.forEach(t => t.release());
        myStream.release();
        peer.destroy();
        navigation.dispatch(popOnce);
        VIForegroundService.stopService().then(r => console.log('background service is stopped'));
    }

    const controlButtons = {
        toggleMicro,
        toggleCamera,
        switchCameraView,
        endCall
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onBodyClick}
            style={{flex: 1}}>
                <VideoChat
                    myStream={myStream}
                    // remoteStreams={[myStream, myStream, myStream, myStream]}
                    remoteStreams={[...remoteStreams]}
                    roomId={roomId}
                    showControlButtons={showControlButtons}
                    controlButtons={controlButtons}
                    setRemoteStreams={setRemoteStreams}
                />
        </TouchableOpacity>
    )
}

