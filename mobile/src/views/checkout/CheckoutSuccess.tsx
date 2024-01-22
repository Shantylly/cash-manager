import React, {useEffect} from 'react';
import {
    BottomTabNavigationProp,
    BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {NavigationStackParamList} from '../../components/Navigation/NavigationStack';
import {StyleSheet, Text, View} from 'react-native';
import Layout from '../../components/Layout/Layout';
import LayoutTop from '../../components/Layout/LayoutTop';
import LayoutBackButton from '../../components/Layout/LayoutBackButton';
import LayoutContainer from '../../components/Layout/LayoutContainer';
import LayoutHeader from '../../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import CheckoutOverview from '../../components/Checkout/CheckoutOverview';
import defaultTheme from '../../themes/defaultTheme';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {cartEmptied} from '../../stores/cart/cartSlice';
import {useQuery} from '@tanstack/react-query';
import {getProfile} from '../../services/user/user.service';
import {selectUser, userProfileChanged} from '../../stores/user/userSlice';

type CheckoutSuccessProps = BottomTabScreenProps<
    NavigationStackParamList['CheckoutStack'],
    'CheckoutSuccess'
>;

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<NavigationStackParamList, 'CheckoutStack'>,
    StackNavigationProp<NavigationStackParamList>
>;

const styles = StyleSheet.create({
    paymentSuccessfull: {
        flex: 1,
        gap: 30,
        marginBottom: 30,
    },
    overview: {
        flex: 1,
    },
    infoText: {
        color: 'grey',
        fontSize: defaultTheme.fontSize.small,
        textAlign: 'center',
    },
});

const CheckoutSuccess = ({navigation, route}: CheckoutSuccessProps) => {
    const navigationHome = useNavigation<NavigationProp>();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(user.access_token),
    });

    const backToHome = () => {
        dispatch(cartEmptied());
        navigationHome.reset({
            index: 0,
            routes: [{name: 'Tabs'}],
        });
    };

    useEffect(() => {
        if (profile.data) {
            dispatch(userProfileChanged(profile.data));
        }
    }, [profile.data]);

    return (
        <Layout>
            <LayoutTop>
                {route.params.isPreview && (
                    <LayoutBackButton navigation={navigation} />
                )}
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Payment" subTitle="Successful">
                    <Ionicons name="bag-check" size={28} color="#fcc300" />
                </LayoutHeader>

                <View style={styles.paymentSuccessfull}>
                    <View style={styles.overview}>
                        <CheckoutOverview billId={route.params.billId} />
                    </View>
                    <Text style={styles.infoText}>
                        Bill ID: {route.params.billId}
                    </Text>
                    {!route.params.isPreview && (
                        <Button onPress={backToHome} content="Back to home" />
                    )}
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default CheckoutSuccess;
