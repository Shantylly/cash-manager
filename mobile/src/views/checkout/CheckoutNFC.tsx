import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Layout from '../../components/Layout/Layout';
import LayoutTop from '../../components/Layout/LayoutTop';
import LayoutBackButton from '../../components/Layout/LayoutBackButton';
import LayoutContainer from '../../components/Layout/LayoutContainer';
import LayoutHeader from '../../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {useFocusEffect} from '@react-navigation/native';
import Callout from '../../components/Callout';
import CheckoutOverview from '../../components/Checkout/CheckoutOverview';
import SeparatorText from '../../components/SeparatorText';
import defaultTheme from '../../themes/defaultTheme';
import CheckoutValidationCard from '../../components/Checkout/CheckoutValidationCard';
import {useMutation} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {selectUser} from '../../stores/user/userSlice';
import {userPayment} from '../../services/user/user.service';
import {NavigationStackParamList} from '../../components/Navigation/NavigationStack';

type CheckoutNFCProps = BottomTabScreenProps<
    NavigationStackParamList['CheckoutStack'],
    'CheckoutNFC'
>;

const styles = StyleSheet.create({
    checkoutView: {
        gap: 20,
        flex: 1,
    },
    paymentStatus: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e6e7e8',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentStatusContent: {
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentStatusContentText: {
        color: 'black',
        fontSize: defaultTheme.fontSize.normal,
        textAlign: 'center',
    },
    paymentStatusContentText2: {
        color: 'grey',
        fontSize: defaultTheme.fontSize.small,
        textAlign: 'center',
    },
    paymentMethod: {
        flex: 1,
        gap: 20,
        marginBottom: 30,
    },
    confirmationBold: {
        fontWeight: 'bold',
    },
});

const CheckoutNFC = ({navigation, route}: CheckoutNFCProps) => {
    const [scannedData, setScannedData] = useState<string>();
    const [isNfcEnabled, setIsNfcEnabled] = useState<boolean>(false);
    const validationTimeSeconds = 3000;

    const user = useSelector(selectUser);
    const billId = route.params.billId;

    const checkNfc = async () => {
        setIsNfcEnabled(await NfcManager.isEnabled());
    };

    const startNfc = async () => {
        try {
            await NfcManager.start();
            NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
                setScannedData(tag?.id);
                NfcManager.unregisterTagEvent().catch(() => 0);
            });
            await NfcManager.registerTagEvent();
        } catch (e) {
            console.warn(e);
        }
    };

    const stopNfc = () => {
        NfcManager.unregisterTagEvent().catch(() => 0);
    };

    useEffect(() => {
        checkNfc();
        startNfc();

        NfcManager.setEventListener(
            NfcEvents.StateChanged,
            async (event: any) => {
                if (event.state === 'on') {
                    setIsNfcEnabled(true);
                    await startNfc();
                } else if (event.state === 'off') {
                    setIsNfcEnabled(false);
                    setScannedData('');
                    stopNfc();
                }
            },
        );

        return () => {
            stopNfc();
            NfcManager.setEventListener(NfcEvents.StateChanged, null);
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                stopNfc();
                navigation.removeListener('beforeRemove', onBackPress);
                navigation.goBack();
                return true;
            };

            navigation.addListener('beforeRemove', onBackPress);

            return () => {
                navigation.removeListener('beforeRemove', onBackPress);
            };
        }, [navigation]),
    );

    const [cardError, setCardError] = useState<string>();

    const {mutate: paymentMutation} = useMutation({
        mutationFn: (data: {token: string; bill_id: string}) =>
            userPayment(data.token, data.bill_id),
        onSuccess: async data => {
            if (data.statusCode === 400) {
                setCardError(data.message);
            } else {
                navigation.navigate('CheckoutSuccess', {billId: billId});
            }
        },
        onError: async error => {
            setCardError(error.message);
        },
    });

    const proceedPayment = () => {
        paymentMutation({
            token: user.access_token,
            bill_id: billId,
        });
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Checkout" subTitle="NFC">
                    <Ionicons name="card-outline" size={28} color="black" />
                </LayoutHeader>

                <View style={styles.checkoutView}>
                    <CheckoutOverview billId={billId} />
                    <SeparatorText content="Payment information" />

                    <View style={styles.paymentMethod}>
                        {!scannedData && (
                            <View style={styles.paymentStatus}>
                                <View style={styles.paymentStatusContent}>
                                    <Text
                                        style={styles.paymentStatusContentText}>
                                        Waiting...
                                    </Text>
                                    <ActivityIndicator
                                        size="large"
                                        color="#fcc300"
                                    />
                                    <Text
                                        style={
                                            styles.paymentStatusContentText2
                                        }>
                                        Bill ID: {billId}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {scannedData && (
                            <CheckoutValidationCard
                                disabled={!!cardError}
                                duration={validationTimeSeconds}
                                onValidation={proceedPayment}>
                                {!scannedData && (
                                    <View style={styles.paymentStatusContent}>
                                        <Text
                                            style={
                                                styles.paymentStatusContentText
                                            }>
                                            {scannedData ? 'OK' : 'Waiting...'}
                                        </Text>
                                        <ActivityIndicator
                                            size="large"
                                            color="#fcc300"
                                        />
                                    </View>
                                )}
                                {scannedData && (
                                    <View style={styles.paymentStatusContent}>
                                        <Text
                                            style={
                                                styles.paymentStatusContentText
                                            }>
                                            Your credit card has been scanned
                                            successfully.
                                        </Text>
                                        <Text>
                                            <Ionicons
                                                name="checkmark-circle-outline"
                                                size={28}
                                                color="#fcc300"
                                            />
                                        </Text>
                                        <Text
                                            style={
                                                styles.paymentStatusContentText2
                                            }>
                                            Card ID: {scannedData}
                                            {'\n'}
                                            Bill ID: {billId}
                                        </Text>
                                    </View>
                                )}
                            </CheckoutValidationCard>
                        )}

                        <View>
                            {!isNfcEnabled && (
                                <Callout type="danger" title="NFC is disabled">
                                    <Text>
                                        Enable NFC in your phone settings to be
                                        able to scan your credit card.
                                    </Text>
                                </Callout>
                            )}

                            {isNfcEnabled && !scannedData && (
                                <Callout
                                    type="info"
                                    title="Scan your credit card">
                                    <Text>
                                        Hold your credit card near the back of
                                        your phone.
                                    </Text>
                                </Callout>
                            )}

                            {scannedData && !cardError && (
                                <Callout
                                    type="success"
                                    title="Confirmation required">
                                    <Text>
                                        Please confirm the payment by long
                                        pressing the card above for{' '}
                                        <Text style={styles.confirmationBold}>
                                            {validationTimeSeconds / 1000}{' '}
                                            seconds.
                                        </Text>
                                    </Text>
                                </Callout>
                            )}

                            {cardError && (
                                <Callout type="danger" title="Error">
                                    <Text>{cardError}</Text>
                                </Callout>
                            )}
                        </View>
                    </View>
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default CheckoutNFC;
