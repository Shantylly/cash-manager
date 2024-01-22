import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import ProductItem from '../components/ProductItem';
import {Product} from '../types/product';
import {useSelector} from 'react-redux';
import {selectCartItemsCount} from '../stores/cart/cartSlice';
import LayoutTop from '../components/Layout/LayoutTop';
import defaultTheme from '../themes/defaultTheme';
import {useQuery} from '@tanstack/react-query';
import {getProducts} from '../services/product/product.service';
import {selectUser} from '../stores/user/userSlice';

type HomeProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    productView: {
        flex: 1,
        marginVertical: 30,
        marginHorizontal: -(30 + 1),
        marginLeft: 0,
    },
    cartIcon: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#fdc300',
        borderRadius: 50,
        width: 18,
        height: 20,
        textAlign: 'center',
        lineHeight: 18,
        fontSize: defaultTheme.fontSize.xsmall,
        color: 'white',
    },
    qrButton: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    qrButtonText: {
        fontSize: defaultTheme.fontSize.small,
        color: 'black',
        paddingBottom: 5,
    },
});

const Home = ({navigation}: HomeProps) => {
    const user = useSelector(selectUser);

    const openCart = () => {
        navigation.navigate('Cart');
    };

    const screenWidth = Dimensions.get('window').width;
    const numColumns = 2;
    const gap = 5;
    const paddingHorizontal = 30 * 2;

    const availableSpace =
        screenWidth - (numColumns - 1) * gap - paddingHorizontal;
    const itemSize = availableSpace / numColumns;

    const cartItemsCount = useSelector(selectCartItemsCount);

    const defaultImage = require('../assets/yellow-chair.png');
    const products = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getProducts,
    });

    return (
        <Layout>
            <LayoutTop>
                <View />
                <TouchableOpacity onPress={openCart}>
                    <Ionicons
                        style={styles.cartIcon}
                        name="cart-outline"
                        size={28}
                        color="black"
                    />
                    <Text style={styles.cartBadge}>{cartItemsCount}</Text>
                </TouchableOpacity>
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Our" subTitle="Products" noBottomMargin>
                    <TouchableOpacity
                        style={styles.qrButton}
                        onPress={() => {
                            navigation.navigate('QR');
                        }}>
                        <Text style={styles.qrButtonText}>Scan products</Text>
                        <Ionicons
                            name="qr-code-outline"
                            size={28}
                            color="black"
                        />
                    </TouchableOpacity>
                </LayoutHeader>

                <View style={styles.productView}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                enabled={true}
                                refreshing={products.isFetching}
                                onRefresh={products.refetch}
                            />
                        }
                        overScrollMode="never"
                        fadingEdgeLength={50}
                        data={products.data?.map(product => ({
                            ...product,
                            photo:
                                typeof product.photo === 'string'
                                    ? defaultImage
                                    : product.photo,
                        }))}
                        renderItem={productItem => (
                            <ProductItem
                                onDeleted={products.refetch}
                                myProduct={
                                    user.id === productItem.item.seller_id
                                }
                                width={itemSize}
                                product={productItem.item}
                            />
                        )}
                        numColumns={numColumns}
                        contentContainerStyle={{gap}}
                        columnWrapperStyle={{gap}}
                    />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Home;
