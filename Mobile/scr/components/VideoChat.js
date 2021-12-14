import React, {useCallback} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import CameraModule from "./CameraModule";
import {VerticalPairOfStreams} from "./VerticalPairOfStreams";

export const VideoChat = ({myStream, remoteStreams, roomId}) => {

    const renderStream = (myStream, partnerStream) => {
        console.log('renderStream');
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

    const renderStreamFullScreen = useCallback((stream) => {
        console.log('renderStreamFullScreen');
        return (
            <CameraModule isMy stream={stream}/>
        )
    }, [])

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
            <FlatList style={{backgroundColor: 'red', width: "100%"}}
                horizontal
                data={pairs}
                renderItem={({item}) => <VerticalPairOfStreams streams={item}/>}
                keyExtractor={(item) => item.id}
            />
        )
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

    console.log(myStream);
    return (
        <View style={styles.container}>
            <View style={styles.roomCredits}>
                <Text style={styles.roomTitle}>
                    Your Room ID: {roomId}
                </Text>
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
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16
    },
    roomTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
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
