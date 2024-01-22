import React from 'react';
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Earnings from '../../views/Earnings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../views/Home';
import AddProduct from '../../views/AddProduct';

interface screenOptionsProps {
    route: {
        name: string;
    };
}

const Tab = createBottomTabNavigator();

const navigatorOptions: ({
    route,
}: screenOptionsProps) => BottomTabNavigationOptions = ({route}) => ({
    tabBarIcon: ({focused, color, size}) => {
        let iconName = '';

        if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
        } else if (route.name === 'Add') {
            iconName = focused ? 'bag-add' : 'bag-add-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
    },
    headerTitle: route.name,
    tabBarShowLabel: false,
    tabBarActiveTintColor: 'black',
    headerShown: false,
    tabBarStyle: {
        backgroundColor: 'white',
        shadowColor: 'transparent',
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        borderTopWidth: 0,
    },
});

const NavigationBar = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={navigatorOptions}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Add" component={AddProduct} />
            <Tab.Screen name="Earnings" component={Earnings} />
        </Tab.Navigator>
    );
};

export default NavigationBar;
