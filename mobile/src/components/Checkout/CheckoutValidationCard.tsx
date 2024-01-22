import React, {useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';

type CheckoutValidationCardProps = {
    children: React.ReactNode;
    duration: number;
    onValidation: () => void;
    disabled?: boolean;
};

const styles = StyleSheet.create({
    paymentStatusButton: {
        position: 'relative',
        flex: 1,
        borderWidth: 1,
        borderColor: '#e6e7e8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentStatusButtonBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#e6e7e8',
        height: '100%',
        borderRadius: 10,
        opacity: 0.5,
    },
});

const CheckoutValidationCard = ({
    children,
    duration,
    onValidation,
    disabled,
}: CheckoutValidationCardProps) => {
    const widthAnim = useState(new Animated.Value(0))[0];

    const startAnimation = () => {
        widthAnim.setValue(0);

        Animated.timing(widthAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
        }).start(({finished}) => {
            if (finished) {
                onValidation();
            }
        });
    };

    const animatedStyle = {
        width: widthAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
    };

    return (
        <TouchableOpacity
            disabled={disabled}
            activeOpacity={1}
            style={styles.paymentStatusButton}
            onPressIn={startAnimation}
            onPressOut={() => widthAnim.setValue(0)}>
            <Animated.View
                style={[styles.paymentStatusButtonBackground, animatedStyle]}
            />
            {children}
        </TouchableOpacity>
    );
};

export default CheckoutValidationCard;
