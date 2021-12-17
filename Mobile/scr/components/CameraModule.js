import React, { useState } from 'react';
import {
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
        flex: 1,
        width: '120%',
        marginLeft: "-10%",

    },
});
