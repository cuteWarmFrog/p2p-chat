import React, { useCallback } from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    View,
    Text
} from './Themed';

import {RTCView} from "react-native-webrtc";

export default function CameraModule(props) {
    const { stream, zOrder } = props;

    const renderStream = useCallback((stream) => {
        if(stream.getVideoTracks()[0].enabled) {
            return <RTCView zOrder={zOrder ? zOrder : 0} style={styles.camera} objectFit={'cover'} streamURL={stream.toURL()} />
        }
        return (
            <View style={styles.noImage}>
                <Text>
                    No image
                </Text>
            </View>
        )
    }, []);

    return (
        <>
            {renderStream(stream)}
        </>

    );
}

const styles = StyleSheet.create({
    camera: {
        // flex: Platform.OS === 'ios' ? 1 : 0,
        // height: Platform.OS === 'ios' ? 'auto' : '100%',
        flex: 1,

    },
    noImage: {
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    }
});
