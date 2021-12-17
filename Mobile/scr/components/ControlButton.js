import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default function ControlButton (props) {
    const { primaryIcon, secondaryIcon, onPress, bgcolor, style } = props;
    const [icon, setIcon] = useState(primaryIcon);
    const [isPressed, setIsPressed] = useState(false);
    const icons = {
        true: primaryIcon,
        false: secondaryIcon
    }
    const colors = {
        true: 'red',
        false: 'white'
    }
    return (
        <TouchableOpacity
            onPress={() => {
                onPress();
                if (secondaryIcon) {
                    setIcon(icons[isPressed])
                }
                setIsPressed(!isPressed);
            }}
            style={[style, styles.controlButtonContainer,
            bgcolor ? {backgroundColor: bgcolor} : { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        ]}>
            <FontAwesomeIcon
                icon={icon}
                color={colors[isPressed]}
                size={30}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    controlButtonContainer: {
        borderRadius: 35,
        padding: 18,
    },
})