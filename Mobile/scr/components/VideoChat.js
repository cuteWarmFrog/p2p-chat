import React, {useCallback, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CameraModule from "./CameraModule";
import {VerticalPairOfStreams} from "./VerticalPairOfStreams";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
    faSyncAlt,
    faVideo,
    faMicrophoneAlt,
    faMicrophoneAltSlash,
    faTimesCircle
    } from '@fortawesome/free-solid-svg-icons';

export const VideoChat = ({myStream, remoteStreams, roomId, showControlButtons}) => {
    const [isPartnerBig, setIsPartnerBig] = useState(true);

    const renderStream = (myStream, partnerStream) => {
        return (
            <>
                <View style={styles.fullscreenCameraContainer}>
                    {isPartnerBig ?
                        (<CameraModule stream={partnerStream}/>) :
                        <CameraModule stream={myStream}/>
                    }
                </View>
                <TouchableOpacity
                    onPress={() => setIsPartnerBig(!isPartnerBig)}
                    style={styles.smallCornerCameraContainer}
                >
                    {!isPartnerBig ?
                        (<CameraModule stream={partnerStream}/>) :
                        <CameraModule withSwitchButton stream={myStream}/>
                    }
                </TouchableOpacity>
            </>
        )
    }

    const renderStreamFullScreen = (stream) => {
        console.log('renderStreamFullScreen');
        return (
            <CameraModule stream={stream}/>
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

    const renderControlButtons = () => {
        //todo Леша, тут нужен дизайн
        if (showControlButtons) {
            return (
                <View style={styles.controlButtons}>
                    <View>
                        <TouchableOpacity>
                            <FontAwesomeIcon icon={faSyncAlt} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <FontAwesomeIcon icon={faMicrophoneAlt} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <FontAwesomeIcon icon={faVideo} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <FontAwesomeIcon icon={faTimesCircle} size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    console.log(isPartnerBig)
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
        alignItems: 'center',
        justifyContent: 'center',
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
        zIndex: 10,
        elevation: 10,
    },

    smallCornerCameraContainer: {
        zIndex: 1000,
        elevation: 1000,
        position: 'absolute',
        top: 25,
        right: 20,
        height: 180,
        width: 110,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    controlButtons: {
        zIndex: 1000,
        elevation: 1000,
        backgroundColor: 'rgb(0,0,0,0.1)',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        borderColor: 'black',
        borderWidth: 3,
    }
});
