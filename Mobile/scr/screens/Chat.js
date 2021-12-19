import React, {useEffect, useState, useCallback} from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import IO from "socket.io-client";
import {VideoChat} from '../components/VideoChat';

import { mediaDevices } from 'react-native-webrtc';

import InCallManager from 'react-native-incall-manager';
import Peer from 'react-native-peerjs';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import {useRoute} from '@react-navigation/native';
import {useForceUpdate} from "../hooks/useForceUpdate";

const URL = 'http://joeyke.ru:14050';

export const Chat = ({ route }) => {

    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const [showControlButtons, setShowControlButtons] = useState(true);
    const [isCamera, setIsCamera] = useState(false);
    const [isMicro, setIsMicro] = useState(false);

    const forceUpdate = useForceUpdate();

    const [peer, setPeer] = useState(null);

    const [timeOutToCloseButtons, setTimeOutToCloseButtons] = useState(null);

    const popOnce = StackActions.pop(1);
    const navigation = useNavigation();

    const { roomId } = route.params;

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

        peerServer.on('open', (userId) => {
            // sending signal to server, on which
            // it will answer with room-joining and that roomId
            localSocket.emit('join-room', {userId, roomId});
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
            connectToNewUser(userId, myStream);
        })

    }, []);

    useEffect(() => {

        // BackgroundTimer.runBackgroundTimer(() => {
        //     console.log('1234')
        //    remoteStreams.forEach((t,index) => {
        //        console.log('asdads',index)
        //        if (t.getVideoTracks()[0].enabled){
        //            console.log('asdads',index)
        //            // let streamArray = [...myStream]
        //            // setRemoteStreams(streamArray.slice(index,1));
        //            // console.log('deleted')
        //        }
        //    })
        //     if (!remoteStreams){
        //         console.log('fghjk')
        //     }
        // }, 500)

        async function startForegroundService() {

            const channelConfig = {
                id: 'channelId',
                name: 'Channel name',
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
        // if(showControlButtons) {
        //     setShowControlButtons(false);
        // } else {
        //     setShowControlButtons(true);
        //     const timeout = setTimeout(() => {
        //         setShowControlButtons(false);
        //     }, 3000);
        //     setTimeOutToCloseButtons(timeout);
        // }
    }

    const endCall = () => {
        clearTimeout(timeOutToCloseButtons);
        myStream.getTracks().forEach(t => t.stop());
        remoteStreams.forEach(tr => tr.getTracks().forEach(t => t.stop()));
        remoteStreams.forEach(t => t.release());
        myStream.release();
        peer.destroy();
        navigation.dispatch(popOnce);
        BackgroundTimer.stopBackgroundTimer();
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
                    //remoteStreams={[myStream, myStream, myStream, myStream]}
                    remoteStreams={[...remoteStreams]}
                    roomId={roomId}
                    showControlButtons={showControlButtons}
                    controlButtons={controlButtons}
                />
        </TouchableOpacity>
    )
}

