import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Product, ProductQuantity} from '../types/product';
import defaultTheme from '../themes/defaultTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';

type CartItemProps = Omit<Product, 'description'> &
    Omit<ProductQuantity, 'product'> & {
        onQuantityPress: (id: string) => void;
        onQuantityAdd: (id: string) => void;
        onQuantityRemove: (id: string) => void;
        displayQuantityEdit: boolean;
    };

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        // marginLeft: -(30 + 1),
        marginRight: 30,
        marginVertical: 20,
    },
    itemColor: {
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        width: 95,
        height: 55,
        alignSelf: 'flex-end',
    },
    itemImage: {
        position: 'absolute',
        right: -5,
        bottom: 10,
        height: 80,
        width: 70,
        resizeMode: 'contain',
    },
    itemProps: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 35,
        height: 75,
    },
    itemName: {
        flexDirection: 'column',
        paddingBottom: 20,
        gap: 6,
        flex: 1,
    },
    itemNameText1: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
    },
    itemNameText2: {
        fontSize: defaultTheme.fontSize.medium,
        fontWeight: '700',
        color: 'black',
    },
    itemQuantity: {
        backgroundColor: '#EFEFEF',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    itemQuantityText: {
        fontSize: defaultTheme.fontSize.normal,
        fontWeight: '700',
        color: 'black',
    },
    editQuantity: {
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    editQuantityButton: {
        backgroundColor: '#EFEFEF',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const CartItem = ({
    seller_id,
    id,
    name,
    price,
    quantity,
    photo,
    onQuantityPress,
    displayQuantityEdit,
    onQuantityAdd,
    onQuantityRemove,
}: CartItemProps) => {
    const defaultColor = '#fdc300';
    return (
        <View style={styles.item}>
            <View style={{...styles.itemColor, backgroundColor: defaultColor}}>
                <Image style={styles.itemImage} source={photo} />
            </View>
            <View style={styles.itemProps}>
                <View style={styles.itemName}>
                    <Text style={styles.itemNameText1}>{name}</Text>
                    <Text style={styles.itemNameText2}>{price} €</Text>
                </View>
                {displayQuantityEdit && (
                    <View style={styles.editQuantity}>
                        <TouchableOpacity
                            style={styles.editQuantityButton}
                            onPress={() => onQuantityRemove(id)}>
                            <Ionicons name="remove" size={20} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.editQuantityButton}
                            onPress={() => onQuantityAdd(id)}>
                            <Ionicons name="add" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.itemQuantity}
                    onPress={() => onQuantityPress(id)}>
                    <Text style={styles.itemQuantityText}>x{quantity}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CartItem;
