import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Bill} from '../types/bill';
import defaultTheme from '../themes/defaultTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

type HistoryCardProps = {
    navigation: BottomTabNavigationProp<any>;
    bill: Bill;
};

const styles = StyleSheet.create({
    historyCard: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#f3f3f4',
        borderRadius: 10,
    },
    cardIcon: {
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    cardInfo: {
        flexDirection: 'column',
    },
    cardInfoAmount: {
        color: 'black',
        fontSize: defaultTheme.fontSize.large,
        fontWeight: '700',
    },
    cardInfoDate: {
        color: 'gray',
        fontSize: defaultTheme.fontSize.small,
    },
    cardDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardDetailsProducts: {
        color: 'gray',
        fontSize: defaultTheme.fontSize.small,
    },
    cardDetailsStatus: {
        color: 'black',
        fontSize: defaultTheme.fontSize.normal,
    },
});

const HistoryCard = ({navigation, bill}: HistoryCardProps) => {
    let color;
    let icon;

    switch (bill.status) {
        case 'Paid':
            color = 'indianred';
            icon = 'trending-up';
            break;
        case 'Pending':
            color = '#fcc300';
            icon = 'remove';
            break;
        case 'Deposit':
            color = '#4daa57';
            icon = 'trending-down';
            break;
        default:
            color = 'gray';
            icon = 'trending-down';
            break;
    }

    const openBill = () => {
        navigation.navigate('CheckoutStack', {
            screen:
                bill.status !== 'Paid' && bill.status !== 'Deposit'
                    ? 'CheckoutNFC'
                    : 'CheckoutSuccess',
            params: {
                billId: bill.id,
                isPreview: true,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.historyCard} onPress={openBill}>
            <View style={styles.cardIcon}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.cardInfoAmount}>{bill.amount} €</Text>
                <Text style={styles.cardInfoDate}>
                    {new Date(Number(bill.timestamp)).toLocaleString()}
                </Text>
            </View>
            <View style={styles.cardDetails}>
                <Text style={styles.cardDetailsProducts}>
                    {bill.products.length} produit
                    {bill.products.length > 1 ? 's' : ''}
                </Text>
                <Text
                    style={{
                        ...styles.cardDetailsStatus,
                        ...{color: color},
                    }}>
                    {bill.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default HistoryCard;
