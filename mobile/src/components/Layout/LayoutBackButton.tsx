import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LayoutBackButtonProps = {
    navigation: BottomTabNavigationProp<any>;
};

const LayoutBackButton = ({navigation}: LayoutBackButtonProps) => {
    const backButton = () => {
        navigation.canGoBack() && navigation.goBack();
    };

    return (
        <View>
            <TouchableOpacity onPress={backButton}>
                <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default LayoutBackButton;
