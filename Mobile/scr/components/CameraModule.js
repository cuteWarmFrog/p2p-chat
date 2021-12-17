import React, { useState } from 'react';
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
    // const [type, setType] = useState(Camera.Constants.Type.front);
    const { stream } = props;

    console.log(stream.getVideoTracks);

    const renderStream = () => {
        console.log('streamEnable:', stream.getVideoTracks()[0].enabled);
        if(stream.getVideoTracks()[0].enabled) {
            return <RTCView style={styles.camera} streamURL={stream.toURL()} />
        }
        return (
            <Image
                style={styles.img}
                source={{uri: DEFAULT_IMAGE}}
            />
        )
    }

    return (
        <View style={styles.camera}>
            {renderStream()}
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

    img: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});
