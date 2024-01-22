import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import defaultTheme from '../themes/defaultTheme';

type InputTextFieldProps = {
    name: string;
    password?: boolean;
    icon?: string;
    placeholder?: string;
    value?: string;
    keyboardType?: TextInputProps['keyboardType'];
    onChange?: (value: string) => void;
};

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        gap: 10,
    },
    input: {
        flex: 1,
        borderRadius: 10,
        fontSize: defaultTheme.fontSize.normal,
    },
});

const InputTextField = ({
    placeholder,
    icon,
    password,
    value,
    onChange,
    keyboardType,
}: InputTextFieldProps) => {
    return (
        <View style={styles.inputField}>
            {icon && <Ionicons name={icon} size={24} color="gray" />}
            <TextInput
                style={styles.input}
                onChangeText={text => onChange && onChange(text)}
                defaultValue={value}
                secureTextEntry={password}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
};

export default InputTextField;
