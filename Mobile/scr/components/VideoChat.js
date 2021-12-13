import React, { useCallback } from 'react';

import {ScrollView, View, StyleSheet } from 'react-native';
import { RTCView } from "react-native-webrtc";

export const VideoChat = ({myStream, remoteStreams}) => {

    const renderStreamHalfScreen = (stream1, stream2) => {
        console.log('renderStreamHalfScreen');
        return (
            <>
                <View style={styles.streamView}>
                    <RTCView style={styles.stream} streamURL={stream1.toURL()} />
                </View>
                <View style={styles.streamView}>
                    <RTCView style={styles.stream} streamURL={stream2.toURL()} />
                </View>
            </>
        )
    }

    const renderStreamFullScreen = useCallback((stream) => {
        console.log('renderStreamFullScreen');
        return (
            <>
                <View style={styles.streamView}>
                    <RTCView style={styles.stream} streamURL={stream.toURL()} />
                </View>
            </>
        )
    }, [])

    //todo Лёша, нужна другая логика на свайп
    const renderMultipleStreams = useCallback((myStream, remoteStreams) => {
        console.log('remoteStream', remoteStreams)
        return (
            <ScrollView horizontal>
                <RTCView stream={myStream.toURL()}/>
                {remoteStreams.map((stream, i) => {
                    return (
                        <View key={i}>
                            <RTCView style={styles.stream} streamURL={stream.toURL()} />
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
            return renderStreamHalfScreen(myStream, remoteStreams[0]);
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
    },

    stream: {
        width: "100%",
        height: "100%"
    },

})