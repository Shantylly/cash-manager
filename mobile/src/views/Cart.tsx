import {Text, StyleSheet, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import Layout from '../components/Layout/Layout';
import {
    selectCartTotal,
    selectCartItemsCount,
    cartEmptied,
    selectCartItemsByQuantity,
    cartAddedById,
    cartRemovedById,
} from '../stores/cart/cartSlice';
import CartItem from '../components/CartItem';
import {FlatList} from 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutHeader from '../components/Layout/LayoutHeader';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutTop from '../components/Layout/LayoutTop';
import defaultTheme from '../themes/defaultTheme';

type CartProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    customLayout: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
    },
    cartView: {
        marginHorizontal: -(30 + 1),
        height: 405,
    },
    cartViewEmpty: {
        height: 405,
    },
    cartInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    cartInfoText1: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'gray',
    },
    cartInfoText2: {
        fontSize: defaultTheme.fontSize.xlarge,
        fontWeight: '700',
        color: 'black',
    },
    cartCheckout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        height: 120,
    },
    cartCheckoutText1: {
        fontSize: defaultTheme.fontSize.large,
        color: 'white',
    },
    cartCheckoutText2: {
        color: 'white',
        fontWeight: '700',
    },
});

const Cart = ({navigation}: CartProps) => {
    const dispatch = useDispatch();
    const cartItemsQuantity = useSelector(selectCartItemsByQuantity);
    const cartTotal = useSelector(selectCartTotal);
    const cartItemsCount = useSelector(selectCartItemsCount);
    const [selectedQuantityItemId, setSelectedQuantityItemId] = useState<
        string | null
    >(null);

    const emptyCart = () => {
        Alert.alert('Empty cart', 'Are you sure you want to empty your cart?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Empty',
                onPress: () => {
                    dispatch(cartEmptied());
                },
            },
        ]);
    };

    const proceedPayment = () => {
        navigation.navigate('CheckoutStack', {
            screen: 'Checkout',
        });
    };

    const handleQuantityEdit = (id: string) => {
        if (selectedQuantityItemId === id) {
            setSelectedQuantityItemId(null);
        } else {
            setSelectedQuantityItemId(id);
        }
    };

    const handleQuantityAdd = (id: string) => {
        dispatch(cartAddedById(id));
    };

    const handleQuantityRemove = (id: string) => {
        dispatch(cartRemovedById(id));
    };

    const defaultImage = require('../assets/yellow-chair.png');

    return (
        <View style={styles.backContainer}>
            <Layout style={styles.customLayout}>
                <LayoutTop>
                    <LayoutBackButton navigation={navigation} />
                </LayoutTop>
                <LayoutContainer>
                    <LayoutHeader title="Shopping" subTitle="Cart">
                        <TouchableOpacity onPress={emptyCart}>
                            <Ionicons
                                name="trash-outline"
                                size={28}
                                color="indianred"
                            />
                        </TouchableOpacity>
                    </LayoutHeader>

                    <View
                        style={
                            cartItemsQuantity.length === 0
                                ? styles.cartViewEmpty
                                : styles.cartView
                        }>
                        {cartItemsQuantity.length === 0 && (
                            <Text>
                                Your cart is empty. Add some products to it!
                            </Text>
                        )}
                        <FlatList
                            fadingEdgeLength={50}
                            overScrollMode="never"
                            data={cartItemsQuantity}
                            renderItem={item => {
                                const product = item.item.product;
                                const quantity = item.item.quantity;
                                return (
                                    <CartItem
                                        seller_id={product.seller_id}
                                        onQuantityAdd={handleQuantityAdd}
                                        onQuantityRemove={handleQuantityRemove}
                                        onQuantityPress={handleQuantityEdit}
                                        displayQuantityEdit={
                                            product.id ===
                                            selectedQuantityItemId
                                        }
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        quantity={quantity}
                                        photo={
                                            typeof product.photo === 'string'
                                                ? defaultImage
                                                : product.photo
                                        }
                                    />
                                );
                            }}
                        />
                    </View>

                    <View style={styles.cartInfo}>
                        <Text style={styles.cartInfoText1}>
                            {cartItemsCount} item{cartItemsCount > 1 ? 's' : ''}
                        </Text>
                        <Text style={styles.cartInfoText2}>{cartTotal} €</Text>
                    </View>
                </LayoutContainer>
            </Layout>

            {cartItemsCount > 0 && (
                <TouchableOpacity
                    onPress={proceedPayment}
                    style={styles.cartCheckout}>
                    <Text style={styles.cartCheckoutText1}>
                        Proceed to{' '}
                        <Text style={styles.cartCheckoutText2}>checkout</Text>
                    </Text>
                    <Ionicons
                        name="chevron-down-circle"
                        size={45}
                        color="#fdc300"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Cart;
