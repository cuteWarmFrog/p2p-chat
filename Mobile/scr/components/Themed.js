/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import {
    Text as DefaultText,
    View as DefaultView,
    TextInput as DefaultTexInput,
    TouchableOpacity as DefaultButton,
    StyleSheet
} from 'react-native';

import Colors from '../constants/Colors';
import { useColorScheme } from 'react-native';

export function useThemeColor(
    props,
    colorName
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function Text(props) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return <DefaultText style={[{color}, style]} {...otherProps} />;
}

export function View(props) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

export function PrimaryButton(props) {
    const {style, lightColor, darkColor, title, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'tint');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return (
        <DefaultButton style={[
            {backgroundColor},
            {borderColor: backgroundColor},
            style,
            styles.buttonContainer,
        ]}
                       {...otherProps}>
            <Text style={[{color}, styles.buttonTitle]}>
                {title}
            </Text>
        </DefaultButton>
    )
}

export function SecondaryButton(props) {
    const {style, lightColor, darkColor, title, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    return (
        <DefaultButton style={[
            {backgroundColor},
            style,
            styles.buttonContainer,
            {borderColor: color}
        ]}
                       {...otherProps}>
            <Text style={[{color}, styles.buttonTitle]}>
                {title}
            </Text>
        </DefaultButton>
    )
}

export function TextInput(props) {
    const {style, placeholder, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    return (
        <DefaultTexInput
            placeholder={placeholder}
            style={[style, {color: color}]} {...otherProps} />
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        fontWeight: 'bold',
        height: 64,
        width: 120
    },
    buttonTitle: {
        fontSize: 20
    }
});