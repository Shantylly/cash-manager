import React from 'react';
import {StyleSheet, View} from 'react-native';

type LayoutContainerProps = {
    children: React.ReactNode;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const LayoutContainer = ({children}: LayoutContainerProps) => {
    return <View style={styles.container}>{children}</View>;
};

export default LayoutContainer;
