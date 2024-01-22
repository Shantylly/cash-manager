import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import defaultTheme from '../themes/defaultTheme';
import {Direction} from '../types/direction';

type ButtonProps = {
    content: string;
    onPress: () => void;
    color?: string;
    textColor?: string;
    disableBordersRadius?: Direction[];
    loading?: boolean;
    disabled?: boolean;
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fcc300',
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: defaultTheme.fontSize.normal,
    },
});

const Button = ({
    content,
    onPress,
    color,
    textColor,
    disableBordersRadius,
    loading,
    disabled,
}: ButtonProps) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={{
                ...styles.button,
                ...(color ? {backgroundColor: color} : {}),
                ...(disableBordersRadius?.includes('topLeft')
                    ? {borderTopLeftRadius: 0}
                    : {}),
                ...(disableBordersRadius?.includes('topRight')
                    ? {borderTopRightRadius: 0}
                    : {}),
                ...(disableBordersRadius?.includes('bottomLeft')
                    ? {borderBottomLeftRadius: 0}
                    : {}),
                ...(disableBordersRadius?.includes('bottomRight')
                    ? {borderBottomRightRadius: 0}
                    : {}),
            }}
            // TODO: Check mutli-presses
            onPress={onPress}>
            <Text
                style={{
                    ...styles.buttonText,
                    ...(textColor ? {color: textColor} : {}),
                }}>
                {content}
            </Text>
            {loading ? <ActivityIndicator size="small" color="black" /> : null}
        </TouchableOpacity>
    );
};

export default Button;
