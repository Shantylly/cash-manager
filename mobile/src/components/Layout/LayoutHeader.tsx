import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import defaultTheme from '../../themes/defaultTheme';

type LayoutHeaderProps = {
    title: string;
    subTitle: string;
    children?: React.ReactNode;
    noBottomMargin?: boolean;
};

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText1: {
        fontSize: defaultTheme.fontSize.xxlarge,
        color: 'black',
        fontWeight: '300',
    },
    headerText2: {
        fontSize: defaultTheme.fontSize.xxlarge,
        fontWeight: '700',
        color: 'black',
    },
});

const LayoutHeader = ({
    title,
    subTitle,
    children,
    noBottomMargin,
}: LayoutHeaderProps) => {
    return (
        <View
            style={{
                ...styles.headerContainer,
                ...(noBottomMargin ? {marginBottom: 0} : {marginBottom: 70}),
            }}>
            <View>
                <Text style={styles.headerText1}>{title}</Text>
                <Text style={styles.headerText2}>{subTitle}</Text>
            </View>

            <View>{children}</View>
        </View>
    );
};

export default LayoutHeader;
