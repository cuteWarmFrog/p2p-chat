import React, {useState, useEffect} from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Text,
} from './Themed';

// import {FontAwesome5} from '@expo/vector-icons';
import { FontAwesomeIcon,  } from '@fortawesome/react-native-fontawesome'
import {RTCView} from "react-native-webrtc";

export default function CameraModule(props) {
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.front);
    const { stream, isMy } = props;

    return (
        <View style={styles.camera}>
            {isMy && <TouchableOpacity style={styles.button}>
                <View style={styles.buttonContainer}>
                    {/*<FontAwesomeIcon icon="airbnb" size={18} color="white"/>*/}
                    {/*<FontAwesomeIcon icon={"facebook"} />*/}
                    <Text style={{color: 'red', zIndex: 11}}>Rotate</Text>
                </View>
            </TouchableOpacity>}
            <RTCView style={styles.camera} streamURL={stream.toURL()} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    camera: {
        // flex: Platform.OS === 'ios' ? 1 : 0,
        // height: Platform.OS === 'ios' ? 'auto' : '100%',
        height: "50%",
        width: '100%',
        padding: 10,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 35,
        height: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        top: 10
    }
});
