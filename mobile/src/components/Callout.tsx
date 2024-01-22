import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import defaultTheme from '../themes/defaultTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

type CalloutProps = {
    children: React.ReactNode;
    title?: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
    dismissablePress?: () => void;
};

const styles = StyleSheet.create({
    settingsView: {
        flex: 1,
    },
    info: {
        padding: 10,
        borderRadius: 10,
    },
    callout: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    calloutTitle: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
        fontWeight: 'bold',
    },
    colorInfo: {
        backgroundColor: '#e8f4fd',
        color: '#1890ff',
    },
    colorSuccess: {
        backgroundColor: '#f6ffed',
        color: '#52c41a',
    },
    colorWarning: {
        backgroundColor: '#fff5e6',
        color: '#faad14',
    },
    colorDanger: {
        backgroundColor: '#ffe6e6',
        color: '#f5222d',
    },
});

const Callout = ({children, title, type, dismissablePress}: CalloutProps) => {
    let usedStyles: any = styles.colorInfo;
    switch (type) {
        case 'info':
            usedStyles = styles.colorInfo;
            break;
        case 'success':
            usedStyles = styles.colorSuccess;
            break;
        case 'warning':
            usedStyles = styles.colorWarning;
            break;
        case 'danger':
            usedStyles = styles.colorDanger;
            break;
    }

    return (
        <TouchableOpacity
            style={{...styles.info, ...usedStyles}}
            activeOpacity={dismissablePress ? 0.2 : 1}
            onPress={() => {
                dismissablePress && dismissablePress();
            }}>
            <View style={styles.callout}>
                <Ionicons
                    name="information-circle"
                    color={usedStyles.color}
                    size={18}
                />
                <Text style={styles.calloutTitle}>{title}</Text>
            </View>
            {children}
        </TouchableOpacity>
    );
};

export default Callout;
