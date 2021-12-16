import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    View
} from 'react-native';

import {RTCView} from "react-native-webrtc";

export default function CameraModule(props) {
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.front);
    const { stream } = props;

    return (
        <View style={styles.camera}>
            <RTCView style={styles.camera} streamURL={stream.toURL()} />
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        // flex: Platform.OS === 'ios' ? 1 : 0,
        // height: Platform.OS === 'ios' ? 'auto' : '100%',
        height: "100%",
        width: '100%',
        padding: 10,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'rgb(40,60,50)',
        borderColor: 'rgb(0,0,0)',
        borderWidth: 3,

        width: 40,
        height: 40,
        borderRadius: 12,
        position: 'absolute',
        bottom: 10,
        right: 10
    },
});
