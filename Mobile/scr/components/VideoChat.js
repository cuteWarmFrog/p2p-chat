import React, {useCallback, useState} from 'react';
import {Button, FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import CameraModule from "./CameraModule";
import {VerticalPairOfStreams} from "./VerticalPairOfStreams";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";

export const VideoChat = ({inCallManager, myStream, remoteStreams, roomId}) => {

    const renderStream = (myStream, partnerStream) => {
        return (
            <>
                <View style={styles.partnerCameraContainer}>
                    <CameraModule stream={partnerStream}/>
                </View>
                <View style={styles.myCameraContainer}>
                    <CameraModule isMy stream={myStream}/>
                </View>
            </>
        )
    }

    const renderStreamFullScreen = (stream) => {
        console.log('renderStreamFullScreen');
        return (
            <CameraModule isMy stream={stream}/>
        )
    }

    const renderMultipleStreams = (myStream, remoteStreams) => {
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
            <SafeAreaView style={{flex: 1, width: '100%'}}>
                <FlatList
                    snapToAlignment="center"
                    horizontal
                    data={pairs}
                    renderItem={({item}) => <VerticalPairOfStreams streams={item}/>}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator
                    pagingEnabled
                />
            </SafeAreaView>

        )
    }

    const [screenState, setScreenState] = useState(false);

    const [microState, setMicroState] = useState(false);

    const turnMicroOff = () => {

        // myStream.getAudioTracks()[0].stop();
       myStream.getAudioTracks()[0].enabled=microState;
       setMicroState(!microState);
        // remoteStreams[0].getAudioTracks()[0].stop();
    }

    const turnScreenOff = () => {

        myStream.getVideoTracks()[0].enabled = screenState;
        setScreenState(!screenState);
        // TODO render something instead of video
    }

    const renderChat = () => {
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
    }

    return (
        <View style={styles.container}>
            <View style={styles.roomCredits}>
                <Text style={styles.roomTitle}>
                    Your Room ID: {roomId}
                </Text>
                <Button title={"Turn screen"}
                        onPress={turnScreenOff}/>
                <Button title={"Turn micro"}
                        onPress={turnMicroOff}/>
            </View>
            {myStream ? renderChat() : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    partnerCameraContainer: {
        zIndex: 10,
        elevation: 10,
    },
    roomCredits: {
        // position: 'absolute',
        // top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    roomTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white'
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
    myCameraContainer: {
        zIndex: 1000,
        elevation: 1000,
        position: 'absolute',
        bottom: 20,
        left: 20,
        height: 180,
        width: 110,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
    }
});
