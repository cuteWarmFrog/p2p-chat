import React, { useCallback } from 'react';
import {
    StyleSheet,
    View as DefaultView
} from 'react-native';
import {
    View,
    Text
} from './Themed';

import {RTCView} from "react-native-webrtc";

export default function CameraModule(props) {
    const { stream, zOrder } = props;


    const renderStream = useCallback(() => {
        if(stream.getVideoTracks()[0].enabled) {
            return <RTCView zOrder={zOrder ? zOrder : 0} style={styles.camera} streamURL={stream.toURL()} />
        }
        return (
            <View style={styles.noImage}>
                <Text>
                    No source image
                </Text>
            </View>
        )
    }, [stream]);

    return (
        <DefaultView style={styles.camera}>
            {renderStream()}
        </DefaultView>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '120%',
        marginLeft: "-10%",

    },
    noImage: {
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    }
});
