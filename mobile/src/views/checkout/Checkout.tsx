import React from 'react';
import Layout from '../../components/Layout/Layout';
import LayoutTop from '../../components/Layout/LayoutTop';
import LayoutBackButton from '../../components/Layout/LayoutBackButton';
import LayoutContainer from '../../components/Layout/LayoutContainer';
import LayoutHeader from '../../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, Text, View} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import defaultTheme from '../../themes/defaultTheme';
import Button from '../../components/Button';
import {useMutation} from '@tanstack/react-query';
import {createBill} from '../../services/bills/bills.service';
import {useSelector} from 'react-redux';
import {selectUser} from '../../stores/user/userSlice';
import {selectCartItems} from '../../stores/cart/cartSlice';

type CheckoutProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    checkoutView: {
        flex: 1,
        gap: 20,
    },
    checkoutViewText1: {
        fontSize: defaultTheme.fontSize.large,
        color: 'black',
    },
});

const Checkout = ({navigation}: CheckoutProps) => {
    const user = useSelector(selectUser);
    const cartItems = useSelector(selectCartItems);

    const {mutate: billsMutation} = useMutation({
        mutationFn: (data: {
            token: string;
            user_id: string;
            type: string;
            products: string[];
        }) => createBill(data.token, data.user_id, data.products),
        onSuccess: async data => {
            navigation.navigate('Checkout' + data.type, {
                billId: data.id,
            });
        },
        onError: async error => {
            console.log(error);
        },
    });

    const checkoutWith = () => {
        billsMutation({
            token: user.access_token,
            user_id: user.id,
            type: 'NFC',
            products: cartItems.map(item => item.id),
        });
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Cart" subTitle="Checkout">
                    <Ionicons name="cart-outline" size={28} color="black" />
                </LayoutHeader>

                <View style={styles.checkoutView}>
                    <Text style={styles.checkoutViewText1}>
                        Choose your payment method
                    </Text>

                    <Button content="Credit Card" onPress={checkoutWith} />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Checkout;
