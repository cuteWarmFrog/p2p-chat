import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import CameraModule from "./CameraModule";
import {VerticalPairOfStreams} from "./VerticalPairOfStreams";

import {
    faSyncAlt,
    faVideo,
    faMicrophoneAlt,
    faMicrophoneAltSlash,
    faPhone
    } from '@fortawesome/free-solid-svg-icons';
import ControlButton from "./ControlButton";

export const VideoChat = (
    {
        myStream,
        remoteStreams,
        roomId,
        showControlButtons,
        controlButtons,
        setRemoteStreams
    }) => {
    const { toggleMicro, toggleCamera, endCall, switchCameraView } = controlButtons;
    const [isPartnerBig, setIsPartnerBig] = useState(true);

    const renderStream = (myStream, partnerStream) => {
        console.log('isPartner big', isPartnerBig);
        return (
            <>
                <View style={styles.fullscreenCameraContainer}>
                    {isPartnerBig ?
                        (<CameraModule stream={partnerStream}/>) :
                        <CameraModule stream={myStream}/>
                    }
                </View>
                <TouchableOpacity style={ styles.smallCornerCameraContainer}
                                  onPress={() => setIsPartnerBig(isPartnerBig => !isPartnerBig)}
                >
                    {!isPartnerBig ?
                        <CameraModule stream={partnerStream} /> :
                        <CameraModule stream={myStream} />
                    }
                </TouchableOpacity>
            </>
        )
    }

    const renderStreamFullScreen = useCallback((stream) => {
        return (
            <CameraModule style={styles.renderStreamFullScreen} stream={stream}/>
        )
    }, [])

    const renderMultipleStreams = useCallback((myStream, remoteStreams) => {
        const pairs = [];
        const streams = [myStream, ...remoteStreams];
        for(let i = 0; i < streams.length; i += 2) {
            pairs.push({
                up: streams[i],
                down: i + 1 < streams.length ? streams[i + 1] : null,
                id: i
            })
        }

        console.log(pairs.length);

        return (
                <FlatList
                    snapToAlignment="center"
                    horizontal
                    data={pairs}
                    renderItem={({item}) => <VerticalPairOfStreams streams={item}/>}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator
                    pagingEnabled
                />
        )
    }, []);

    const renderChat = useCallback(() => {
        if (!remoteStreams)
            return null;

        if (remoteStreams.length === 0) {
            return renderStreamFullScreen(myStream);
        }

        if (remoteStreams.length === 1) {
            return renderStream(myStream, remoteStreams[0]);
        }

        if (remoteStreams.length > 1) {
            return renderMultipleStreams(myStream, remoteStreams);
        }
    },[myStream, remoteStreams]);

    // removing null streams
    useEffect(() => {
        remoteStreams.forEach((track, index) => {
            track.getVideoTracks().forEach(t=> {
                    if (!t){
                        let arrayStream = [...remoteStreams];
                        setRemoteStreams(arrayStream.slice(index,1))
                    }
                }
            )
        })
    }, [myStream, remoteStreams]);

    const renderControlButtons = useCallback(() => {
        if (showControlButtons) {
            return (
                <View style={styles.controlButtons}>
                    <ControlButton primaryIcon={faSyncAlt} onPress={switchCameraView} />
                    <ControlButton primaryIcon={faMicrophoneAlt} secondaryIcon={faMicrophoneAltSlash} onPress={toggleMicro} />
                    <ControlButton primaryIcon={faVideo} onPress={toggleCamera} />
                    <ControlButton primaryIcon={faPhone} onPress={endCall} bgcolor={'rgba(180, 0, 0, 0.7)'} />
                </View>
            )
        }
    }, [toggleCamera, toggleMicro, switchCameraView, endCall, showControlButtons]);

    console.log('streams now:', remoteStreams.length);

    return (
        <View style={styles.container}>
            <View style={styles.roomCredits}>
                <Text style={styles.roomTitle}>
                    Your Room ID: {roomId}
                </Text>
            </View>
            <View style={styles.cameras}>
                {myStream ? renderChat() : null}
            </View>
            {renderControlButtons()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    renderStreamFullScreen: {
        flex: 1,
        // marginLeft: "-10%",
    },
    cameras: {
        flex: 1
    },
    roomCredits: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        zIndex: 10,
        alignItems: 'center',
        padding: 5
    },
    roomTitle: {
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 5,
        color: 'black',
    },
    roomSubtitle: {
        fontSize: 24,
        color: 'white'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%'
    },
    fullscreenCameraContainer: {
        flex: 1,
        width: "120%",
        marginLeft: "-10%",
    },
    smallCornerCameraContainer: {
        zIndex: 1500,
        elevation: 1500,
        position: 'absolute',
        top: 25,
        right: 25,
        height: 180,
        width: 110,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
    },
    controlButtons: {
        zIndex: 1000,
        elevation: 1000,
        position: 'absolute',
        bottom: 15,
        width: '100%',
        height: 80,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderColor: 'black',
    }
});
