import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutHeader from '../components/Layout/LayoutHeader';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import InputTextField from '../components/InputTextField';
import Button from '../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {version} from '../../package.json';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import defaultTheme from '../themes/defaultTheme';
import {useDispatch} from 'react-redux';
import {useMutation} from '@tanstack/react-query';
import {register} from '../services/auth/auth.service';
import Callout from '../components/Callout';
import {accessTokenChanged, userProfileChanged} from '../stores/user/userSlice';
import {getProfile} from '../services/user/user.service';

type RegisterProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    registerView: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 30,
        gap: 10,
    },
    welcome: {
        width: '100%',
    },
    welcomeText1: {
        fontSize: defaultTheme.fontSize.large,
        color: 'black',
    },
    welcomeText2: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'gray',
    },
    registerForm: {
        marginTop: 20,
        gap: 5,
    },
    registerFormContent: {
        gap: 20,
    },
    submit: {
        marginTop: 50,
    },
    version: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    versionText: {
        color: 'gray',
        fontSize: defaultTheme.fontSize.normal,
    },
});

const Register = ({navigation}: RegisterProps) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [error, setError] = React.useState('');
    const dispatch = useDispatch();

    const {mutate: registerMutation, isPending: isRegisterPending} =
        useMutation({
            mutationFn: (data: {
                username: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
            }) =>
                register(
                    data.username,
                    data.email,
                    data.password,
                    data.firstName,
                    data.lastName,
                ),
            onSuccess: async data => {
                dispatch(accessTokenChanged(data.access_token));
                try {
                    const profile = await getProfile(data.access_token);
                    dispatch(userProfileChanged(profile));
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Tabs'}],
                    });
                } catch (err: any) {
                    setError(err.message);
                }
            },
            onError: err => {
                setError(err.message);
            },
        });

    const processRegister = () => {
        setError('');
        registerMutation({username, password, email, firstName, lastName});
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Cash" subTitle="Manager">
                    <Ionicons name="wallet" color="#fcc300" size={28} />
                </LayoutHeader>

                <View style={styles.registerView}>
                    <View style={styles.welcome}>
                        <Text style={styles.welcomeText1}>Welcome !</Text>
                        <Text style={styles.welcomeText2}>
                            Please enter your credentials to register
                        </Text>
                    </View>

                    {error !== '' && (
                        <Callout
                            type="danger"
                            title="Error"
                            dismissablePress={() => setError('')}>
                            <Text>{error}</Text>
                        </Callout>
                    )}

                    <View style={styles.registerForm}>
                        <InputTextField
                            name="First name"
                            icon="person"
                            placeholder="First name"
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <InputTextField
                            name="Last name"
                            icon="person"
                            placeholder="Last name"
                            value={lastName}
                            onChange={setLastName}
                        />
                        <InputTextField
                            name="Username"
                            icon="person"
                            placeholder="Username"
                            value={username}
                            onChange={setUsername}
                        />
                        <InputTextField
                            name="Email"
                            icon="mail"
                            placeholder="Email"
                            value={email}
                            onChange={setEmail}
                        />
                        <InputTextField
                            name="Password"
                            icon="lock-closed"
                            placeholder="Password"
                            password
                            value={password}
                            onChange={setPassword}
                        />
                        <InputTextField
                            name="Password"
                            icon="lock-closed"
                            placeholder="Password confirmation"
                            password
                        />
                    </View>

                    <View style={styles.submit}>
                        <Button content="Register" onPress={processRegister} />
                    </View>

                    <View style={styles.version}>
                        <Text style={styles.versionText}>
                            version {version}
                        </Text>
                    </View>
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Register;
