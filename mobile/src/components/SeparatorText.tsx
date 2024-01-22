import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type SeparatorTextProps = {
    content?: string;
    verticalSpace?: number;
};

const styles = StyleSheet.create({
    separatorContainer: {
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    separator: {
        borderRadius: 50,
        width: '100%',
        backgroundColor: '#C4C4C4',
        height: 1,
        position: 'relative',
    },
    content: {
        position: 'absolute',
        backgroundColor: 'white',
        alignSelf: 'center',
        top: -10,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
});

const SeparatorText = ({content, verticalSpace}: SeparatorTextProps) => {
    return (
        <View
            style={{
                ...styles.separatorContainer,
                ...(verticalSpace ? {marginVertical: verticalSpace} : {}),
            }}>
            <View style={styles.separator} />
            <Text style={styles.content}>{content}</Text>
        </View>
    );
};

export default SeparatorText;
