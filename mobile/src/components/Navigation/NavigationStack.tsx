import React from 'react';
import {
    StackNavigationOptions,
    createStackNavigator,
} from '@react-navigation/stack';
import Cart from '../../views/Cart';
import NavigationBar from './NavigationTab';
import Login from '../../views/Login';
import Register from '../../views/Register';
import Settings from '../../views/Settings';
import Checkout from '../../views/checkout/Checkout';
import CheckoutNFC from '../../views/checkout/CheckoutNFC';
import QRCode from '../../views/QRCode';
import CheckoutSuccess from '../../views/checkout/CheckoutSuccess';

interface screenOptionsProps {
    route: {
        name: string;
    };
}

export type NavigationStackParamList = {
    Login: undefined;
    Register: undefined;
    Cart: undefined;
    Settings: undefined;
    CheckoutStack: {
        Checkout: undefined;
        CheckoutNFC: {
            billId: string;
        };
        CheckoutSuccess: {
            billId: string;
            isPreview: boolean;
        };
    };
    Tabs: undefined;
    QR: undefined;
};

const navigatorOptions: ({
    route,
}: screenOptionsProps) => StackNavigationOptions = ({route}) => ({
    headerShown: false,
    headerTitle: route.name,
});

const NavigationStack = () => {
    const Stack = createStackNavigator<NavigationStackParamList>();

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={navigatorOptions}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
                name="CheckoutStack"
                component={NavigationCheckoutStack}
            />
            <Stack.Screen name="Tabs" component={NavigationBar} />
            <Stack.Screen name="QR" component={QRCode} />
        </Stack.Navigator>
    );
};

const NavigationCheckoutStack = () => {
    const Stack =
        createStackNavigator<NavigationStackParamList['CheckoutStack']>();

    return (
        <Stack.Navigator
            initialRouteName="Checkout"
            screenOptions={navigatorOptions}>
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen
                name="CheckoutNFC"
                component={CheckoutNFC}
                initialParams={{billId: undefined}}
            />
            <Stack.Screen
                name="CheckoutSuccess"
                component={CheckoutSuccess}
                initialParams={{billId: undefined}}
            />
        </Stack.Navigator>
    );
};

export default NavigationStack;
