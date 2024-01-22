import React, {useLayoutEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera';
import Callout from '../components/Callout';
import Button from '../components/Button';
import {useMutation} from '@tanstack/react-query';
import {getProductById} from '../services/product/product.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../stores/user/userSlice';
import {cartAdded} from '../stores/cart/cartSlice';

type QRCodesProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    checkoutView: {
        flex: 1,
        gap: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    cameraView: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
});

const QRCode = ({navigation}: QRCodesProps) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const cameraRef = React.useRef<Camera>(null);
    const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());

    const includeCodeWord = 'cashmanager_product:';

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: codes => {
            codes.forEach(code => {
                if (code.value && code.value.startsWith(includeCodeWord)) {
                    const codeValue = code.value.replace(includeCodeWord, '');
                    setScannedCodes(
                        prev => new Set([...prev, codeValue || '']),
                    );
                }
            });
        },
    });

    const {mutate: productsMutation} = useMutation({
        mutationFn: () => {
            const products = [...scannedCodes].map(id =>
                getProductById(user.access_token, id),
            );

            return Promise.all(products);
        },
        onSuccess: products => {
            products.forEach(product => {
                if (!product) return;
                if (!product.id) return;
                dispatch(cartAdded(product));
            });
            setScannedCodes(new Set());

            if (products.length === 1) {
                Alert.alert(
                    'Product added',
                    'The product has been added to your cart.',
                );
            } else if (products.length > 1) {
                Alert.alert(
                    'Products added',
                    'The products have been added to your cart.',
                );
            }
        },
        onError: error => {
            console.log(error);
        },
    });

    const addScannedProducts = () => {
        productsMutation();
    };

    useLayoutEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                {!hasPermission && (
                    <View style={styles.checkoutView}>
                        <Callout type="danger" title="No access to camera">
                            <Text>
                                No access to camera. Please allow access to
                                camera in your phone settings or press the
                                button below to request access.
                            </Text>
                        </Callout>

                        <Button
                            onPress={requestPermission}
                            content="Request access"
                        />
                    </View>
                )}

                {hasPermission && (
                    <View style={styles.checkoutView}>
                        {!device && (
                            <Callout
                                type="danger"
                                title="No camera device found">
                                <Text>No camera device found</Text>
                            </Callout>
                        )}
                        {device && (
                            <>
                                <Callout type="info" title="Scan your products">
                                    <Text>
                                        Scan one or more products to add them
                                        instantly to your cart.
                                    </Text>
                                </Callout>
                                <View style={styles.cameraView}>
                                    <Camera
                                        ref={cameraRef}
                                        style={styles.camera}
                                        codeScanner={codeScanner}
                                        device={device}
                                        isActive={true}
                                    />
                                </View>
                            </>
                        )}

                        <Button
                            content={
                                'Add ' +
                                [...scannedCodes].length +
                                ' product' +
                                ([...scannedCodes].length > 1 ? 's' : '') +
                                ' to cart'
                            }
                            onPress={addScannedProducts}
                        />
                    </View>
                )}
            </LayoutContainer>
        </Layout>
    );
};

export default QRCode;
