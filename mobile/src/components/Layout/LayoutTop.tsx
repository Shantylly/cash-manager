import React from 'react';
import {StyleSheet, View} from 'react-native';

type LayoutTopProps = {
    children: React.ReactNode;
};

const styles = StyleSheet.create({
    layoutTop: {
        position: 'absolute',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        paddingTop: 30,
    },
});

const LayoutTop = ({children}: LayoutTopProps) => {
    return <View style={styles.layoutTop}>{children}</View>;
};

export default LayoutTop;
