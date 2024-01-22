import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text} from 'react-native';
import {View} from 'react-native';
import InputTextField from '../components/InputTextField';
import defaultTheme from '../themes/defaultTheme';
import Callout from '../components/Callout';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectSettings,
    settingsUrlChanged,
} from '../stores/settings/settingsSlice';

type SettingsProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    settingsView: {
        marginTop: 30,
        gap: 20,
        flex: 1,
    },
    calloutInfoText: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
    },
});

const Settings = ({navigation}: SettingsProps) => {
    const settings = useSelector(selectSettings);
    const dispatch = useDispatch();

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="App" subTitle="Settings" noBottomMargin>
                    <Ionicons name="settings" color="#fcc300" size={28} />
                </LayoutHeader>

                <View style={styles.settingsView}>
                    <Callout type="warning" title="For experienced users only">
                        <Text style={styles.calloutInfoText}>
                            Theses settings must be set before using the app.
                        </Text>
                    </Callout>
                    <InputTextField
                        name="ServerUrl"
                        icon="link"
                        placeholder="Server URL"
                        value={settings.serverUrl}
                        onChange={value => {
                            dispatch(settingsUrlChanged(value));
                        }}
                    />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Settings;
