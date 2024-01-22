import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    style?: any;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 80,
        paddingBottom: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
});

const Layout = ({children, style}: Props) => {
    return (
        <SafeAreaView
            style={{
                ...styles.container,
                ...style,
            }}>
            {children}
        </SafeAreaView>
    );
};

export default Layout;
