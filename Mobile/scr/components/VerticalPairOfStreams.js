import React from "react";
import CameraModule from "./CameraModule";
import {View} from "react-native";

export const VerticalPairOfStreams = ({streams}) => {
    const {up, down, id} = streams;
    return (
        <View style={{
            flexDirection: 'column',
            borderWidth: 3,
            borderColor: 'yellow'
        }}>
            <View>
                <CameraModule stream={up}/>
            </View>
            <View>
                <CameraModule isMy stream={down}/>
            </View>
        </View>
    );
}
