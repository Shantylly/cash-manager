import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputTextField from '../components/InputTextField';
import Button from '../components/Button';
import {
    Asset,
    launchCamera,
    launchImageLibrary,
} from 'react-native-image-picker';
import {useMutation} from '@tanstack/react-query';
import {uploadImage} from '../services/image/image.service';
import {IMGUR_CLIENT_ID} from '@env';
import {createProduct} from '../services/product/product.service';
import {Product} from '../types/product';
import {useSelector} from 'react-redux';
import {selectUser} from '../stores/user/userSlice';
import uuid from 'react-native-uuid';

type AddProductProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    viewContainer: {
        flex: 1,
    },
    productForm: {
        flex: 1,
        gap: 10,
    },
    photoField: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
});

const AddProduct = ({navigation}: AddProductProps) => {
    const user = useSelector(selectUser);
    const defaultImage = require('../assets/yellow-chair.png');

    const [productName, setProductName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [price, setPrice] = React.useState<number>();
    const [photo, setPhoto] = React.useState<string>();

    type ProductCreation = Product & {seller_id: string};

    const {mutate: uploadMutation} = useMutation({
        mutationFn: (data: {clientId: string; asset: Asset}) =>
            uploadImage(data.clientId, data.asset),
        onSuccess: async data => {
            console.log('data', data);
        },
        onError: async error => {
            console.log('error', error);
        },
    });

    const {mutate: addProductMutation} = useMutation({
        mutationFn: (data: {token: string; product: ProductCreation}) =>
            createProduct(data.token, data.product),
        onSuccess: async data => {
            console.log('data', data);
            setProductName('');
            setDescription('');
            setPrice(0);
            setPhoto('');
        },
        onError: async error => {
            console.log('error', error);
        },
    });

    const addPhoto = () => {
        launchCamera({mediaType: 'photo'}, async response => {
            const firstImage = response.assets && response.assets[0];
            if (firstImage) {
                // uploadMutation({
                //     clientId: IMGUR_CLIENT_ID ?? '',
                //     asset: firstImage,
                // });
                setPhoto('photo');
            }
        });
    };

    const addProduct = () => {
        const product: ProductCreation = {
            name: productName,
            description,
            price: price ?? 0,
            photo: photo ?? defaultImage,
            id: uuid.v4().toString(),
            seller_id: user.id,
        };

        addProductMutation({
            token: user.access_token,
            product,
        });
    };

    const buttonValidation =
        productName && description && price && photo ? true : false;

    return (
        <KeyboardAvoidingView style={styles.viewContainer} behavior={'height'}>
            <Layout style={styles.view}>
                <LayoutTop>
                    <LayoutBackButton navigation={navigation} />
                </LayoutTop>
                <LayoutContainer>
                    <LayoutHeader title="Add" subTitle="Product">
                        <TouchableOpacity>
                            <Ionicons
                                name="bag-add"
                                size={28}
                                color="#fdc300"
                            />
                        </TouchableOpacity>
                    </LayoutHeader>

                    <View style={styles.productForm}>
                        <Text>Product Name</Text>
                        <InputTextField
                            value={productName}
                            onChange={setProductName}
                            name="ProductName"
                            icon="pricetag-outline"
                            placeholder="Product name"
                        />

                        <Text>Description</Text>
                        <InputTextField
                            value={description}
                            onChange={setDescription}
                            name="Description"
                            icon="document-text-outline"
                            placeholder="Description"
                        />

                        <Text>Price</Text>
                        <InputTextField
                            value={price?.toString()}
                            onChange={(value: string) =>
                                setPrice(Number(value))
                            }
                            name="Price"
                            icon="cash-outline"
                            placeholder="Price"
                            keyboardType="numeric"
                        />

                        <Text>Photo</Text>
                        <Button
                            content={photo ? 'Change photo' : 'Add photo'}
                            onPress={addPhoto}
                            color="#f3f3f4"
                        />
                    </View>
                </LayoutContainer>
            </Layout>
            <Button
                disabled={buttonValidation ? false : true}
                color={buttonValidation ? '#fdc300' : 'gray'}
                textColor={buttonValidation ? 'black' : 'white'}
                content="Add product"
                disableBordersRadius={[
                    'bottomLeft',
                    'bottomRight',
                    'topLeft',
                    'topRight',
                ]}
                onPress={addProduct}
            />
        </KeyboardAvoidingView>
    );
};

export default AddProduct;

