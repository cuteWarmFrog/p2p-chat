import React, { useState, useCallback } from 'react';

import {ScrollView, View, StyleSheet, Text} from 'react-native';
import { RTCView } from "react-native-webrtc";

export const VideoChat = ({myStream, remoteStreams}) => {
    const [page, setPage] = useState(0);

    const renderStreamHalfScreen = (stream1, stream2) => {
        console.log('renderStreamHalfScreen');
        return (
            <>
                <View style={styles.streamView}>
                    {/*<RTCView style={styles.halfScreenStream} streamURL={stream1.toURL()} />*/}
                    <Text style={{ alignSelf: 'center', fontSize: 24, margin: 8, fontWeight: 'bold' }}>P2P webRTC</Text>
                </View>
                <View style={styles.streamView}>
                    {/*<RTCView style={styles.halfScreenStream} streamURL={stream2.toURL()} />*/}
                </View>
            </>
        )
    }

    const renderStreamFullScreen = useCallback((stream) => {
        console.log('renderStreamFullScreen');
        return (
            <>
                <View style={styles.streamView}>
                    <RTCView style={styles.fullScreenStream} streamURL={stream.toURL()} />
                </View>
            </>
        )
    }, [])

    const renderMultipleStreams = useCallback((myStream, remoteStreams) => {
        console.log('remoteStream', remoteStreams)
        return (
            <ScrollView horizontal>
                <RTCView stream={myStream.toURL()}/>
                {remoteStreams.map((stream, i) => {
                    return (
                        <View key={i}>
                            <RTCView streamURL={stream.toURL()} />
                        </View>
                    )
                })}
            </ScrollView>
        )
    }, []);

    const renderChat = () => {
        if(!remoteStreams)
            return null;

        if(remoteStreams.length === 0) {
            return renderStreamFullScreen(myStream);
        }

        if(remoteStreams.length === 1) {
            renderStreamHalfScreen(myStream, remoteStreams[0])
        }

        if(remoteStreams.length > 1) {
            return renderMultipleStreams(myStream, remoteStreams);
        }


    }

    console.log(myStream);
    return (
        <View style={styles.videoChat}>
            {myStream ? renderChat() : null}
        </View>
    )
}

const styles = StyleSheet.create({
    videoChat: {
        flex: 1,
        flexDirection: 'column',
        borderColor: "grey",
        borderWidth: 3,
    },

    streamView: {
        flex: 1,
        borderColor: "red",
        borderWidth: 3,
        backgroundColor: 'red',
        height: 200,
        width: 200
    },

    fullScreenStream: {
        // width: "100%",
        // height: "100%"
    },

    halfScreenStream: {
        // width: "100%",
        // height: "50%"
    },

    multiScreenStream: {
        // width: "50%",
        // height: "50%"
    }

})