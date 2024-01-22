import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import defaultTheme from '../../themes/defaultTheme';

type LayoutSettingsButtonProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    settingsButtonView: {
        flex: 1,
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 5,
    },
    settingsButtonText: {
        color: 'black',
        fontSize: defaultTheme.fontSize.normal,
    },
});

const LayoutSettingsButton = ({navigation}: LayoutSettingsButtonProps) => {
    const settingsButton = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.settingsButtonView}>
            <TouchableOpacity
                onPress={settingsButton}
                style={styles.settingsButton}>
                <Text style={styles.settingsButtonText}>Settings</Text>
                <Ionicons name="settings-outline" size={25} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default LayoutSettingsButton;
