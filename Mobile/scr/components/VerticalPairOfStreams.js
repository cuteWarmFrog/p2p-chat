import React from "react";
import CameraModule from "./CameraModule";
import {View, StyleSheet} from "react-native";
import window from '../constants/Layout';

export const VerticalPairOfStreams = ({streams}) => {
    const {up, down, isMy = false} = streams;

    return (
        <View style={styles.container}>
            <View style={styles.camera}>
                <CameraModule isMy={isMy} stream={up}/>
            </View>
            <View style={styles.camera}>
                {down && <CameraModule stream={down}/>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 3,
        borderColor: 'yellow',
        width: window.window.width  / 2,
        height: window.window.height - 150,

    },

    camera: {
        flex: 1
    }
})
