import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import doggo from '../constants/doggo.jpg';
const DEFAULT_IMAGE = Image.resolveAssetSource(doggo).uri;

import {RTCView} from "react-native-webrtc";

export default function CameraModule(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const { stream } = props;

    const renderStream = useCallback(() => {
        if(stream.getVideoTracks()[0].enabled) {
            return <RTCView style={styles.camera} streamURL={stream.toURL()} />
        }
        return (
            // return static image here in case of turned off camera
        <RTCView style={styles.camera} streamURL={DEFAULT_IMAGE} />
        )
    }, [stream]);

    return (
        <View style={styles.camera}>
            {renderStream()}
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '120%',
        marginLeft: "-10%",

    },

    img: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});
