import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import defaultTheme from '../../themes/defaultTheme';
import {useQueries, useQuery} from '@tanstack/react-query';
import {Bill} from '../../types/bill';
import {selectUser} from '../../stores/user/userSlice';
import {getBill} from '../../services/bills/bills.service';
import {getProductById} from '../../services/product/product.service';
import {ProductQuantity} from '../../types/product';

type CheckoutOverviewProps = {
    billId: string;
};

const styles = StyleSheet.create({
    overview: {
        gap: 20,
    },
    overviewLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    overviewLineText1: {
        fontSize: defaultTheme.fontSize.medium,
        color: 'black',
    },
    overviewLineText2: {
        fontWeight: 'bold',
        fontSize: defaultTheme.fontSize.medium,
        color: 'black',
    },
    subOverviewLineText1: {
        fontSize: defaultTheme.fontSize.small,
        color: 'grey',
    },
    subOverviewLineText2: {
        fontSize: defaultTheme.fontSize.small,
        color: 'grey',
    },
});

const CheckoutOverview = ({billId}: CheckoutOverviewProps) => {
    const user = useSelector(selectUser);
    const billDetail = useQuery<Bill>({
        queryKey: ['billDetail'],
        queryFn: () => getBill(user.access_token, billId),
    });

    let cartTotal = billDetail.data?.amount || 0;
    const vat = cartTotal * 0.2;

    const vatOmitted = true;
    const total = cartTotal + (vatOmitted ? 0 : vat);

    const queries = billDetail.data
        ? billDetail.data.products.map(product => ({
              queryKey: ['product', product],
              queryFn: () => getProductById(user.access_token, product),
          }))
        : [];

    const products = useQueries({
        queries: queries,
    });

    const productsQuantity = {} as {[id: string]: ProductQuantity};
    products.forEach(product => {
        if (!product.data) {
            return;
        }

        if (productsQuantity[product.data.id]) {
            productsQuantity[product.data.id].quantity += 1;
            return;
        }

        productsQuantity[product.data.id] = {
            product: product.data,
            quantity: 1,
        };
    });

    const formatNumber = (number: number) => {
        if (Number.isInteger(number)) {
            return number;
        }

        return number.toFixed(2).replace('.', ',');
    };

    if (billDetail.isLoading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.overview}>
            <View>
                <View style={styles.overviewLine}>
                    <Text style={styles.overviewLineText1}>
                        Cart ({billDetail.data?.products.length} item
                        {(billDetail.data?.products.length || 0) > 1 ? 's' : ''}
                        )
                    </Text>
                    <Text style={styles.overviewLineText2}>
                        {formatNumber(cartTotal)} €
                    </Text>
                </View>
                {Object.values(productsQuantity).map(cartItem => (
                    <View key={cartItem.product.id} style={styles.overviewLine}>
                        <Text style={styles.subOverviewLineText1}>
                            {cartItem.product.name} (x{cartItem.quantity})
                        </Text>
                        <Text style={styles.subOverviewLineText2}>
                            +{' '}
                            {formatNumber(
                                cartItem.product.price * cartItem.quantity,
                            )}{' '}
                            €
                        </Text>
                    </View>
                ))}
            </View>
            <View>
                <View style={styles.overviewLine}>
                    <Text style={styles.overviewLineText1}>VAT</Text>
                    <Text style={styles.overviewLineText2}>
                        {formatNumber(vat)} €
                    </Text>
                </View>
                {vatOmitted && (
                    <View style={styles.overviewLine}>
                        <Text style={styles.subOverviewLineText1}>
                            VAT omitted
                        </Text>
                        <Text style={styles.subOverviewLineText2}>
                            - {formatNumber(vat)} €
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.overviewLine}>
                <Text style={styles.overviewLineText1}>Total</Text>
                <Text style={styles.overviewLineText2}>
                    {formatNumber(total)} €
                </Text>
            </View>
        </View>
    );
};

export default CheckoutOverview;
