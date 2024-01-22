import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutHeader from '../components/Layout/LayoutHeader';
import {selectUser} from '../stores/user/userSlice';
import {useSelector} from 'react-redux';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import defaultTheme from '../themes/defaultTheme';
import {useQuery} from '@tanstack/react-query';
import {Bill} from '../types/bill';
import {getBillsByUser} from '../services/bills/bills.service';
import HistoryCard from '../components/HistoryCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

type EarningsProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    earningsView: {
        flex: 1,
    },
    earningsViewLabel: {
        color: 'black',
        fontSize: defaultTheme.fontSize.normal,
        marginBottom: 10,
    },
    list: {
        flex: 1,
        marginBottom: 10,
    },
    listContainer: {
        gap: 10,
    },
    earningsTotalView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        gap: 10,
    },
    earningsTotalViewCard: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f3f3f4',
        borderRadius: 10,
    },
    earningTotalText1: {
        color: 'gray',
        fontSize: defaultTheme.fontSize.small,
    },
    earningTotalText2: {
        color: 'black',
        fontSize: defaultTheme.fontSize.large,
        fontWeight: 'bold',
    },
});

const Earnings = ({navigation}: EarningsProps) => {
    const user = useSelector(selectUser);

    const bills = useQuery<Bill[]>({
        queryKey: ['bills'],
        queryFn: () => getBillsByUser(user.access_token, user.id),
        select: data => {
            data.sort((a, b) => {
                const aDate = new Date(Number(a.timestamp));
                const bDate = new Date(Number(b.timestamp));
                return bDate.getTime() - aDate.getTime();
            });
            return data;
        },
    });

    return (
        <Layout>
            <LayoutContainer>
                <LayoutHeader title="Your" subTitle="earnings" noBottomMargin>
                    <Ionicons name="cash-outline" size={28} color="#fdc300" />
                </LayoutHeader>

                <View style={styles.earningsView}>
                    <View style={styles.earningsTotalView}>
                        <View style={styles.earningsTotalViewCard}>
                            <Text style={styles.earningTotalText1}>
                                Deposit{' '}
                                <Ionicons
                                    name="trending-down"
                                    color={'#4daa57'}
                                />
                            </Text>
                            <Text style={styles.earningTotalText2}>
                                {bills.data
                                    ?.filter(b => b.status === 'Deposit')
                                    .reduce(
                                        (acc, bill) => acc + bill.amount,
                                        0,
                                    ) || 0}{' '}
                                €
                            </Text>
                        </View>
                        <View style={styles.earningsTotalViewCard}>
                            <Text style={styles.earningTotalText1}>
                                Paid{' '}
                                <Ionicons
                                    name="trending-up"
                                    color="indianred"
                                />
                            </Text>
                            <Text style={styles.earningTotalText2}>
                                {bills.data
                                    ?.filter(b => b.status === 'Paid')
                                    .reduce(
                                        (acc, bill) => acc + bill.amount,
                                        0,
                                    ) || 0}{' '}
                                €
                            </Text>
                        </View>
                        <View style={styles.earningsTotalViewCard}>
                            <Text style={styles.earningTotalText1}>
                                Balance <Ionicons name="wallet-outline" />
                            </Text>
                            <Text style={styles.earningTotalText2}>
                                {user.balance} €
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.earningsViewLabel}>
                        Payment history ({bills.data?.length || 0} bill
                        {bills.data?.length !== 1 && 's'},{' '}
                        {bills.data?.filter(b => b.status === 'Pending')
                            .length || 0}{' '}
                        pending)
                    </Text>

                    {bills.isLoading && <ActivityIndicator size={'large'} />}
                    {bills.data?.length === 0 && !bills.isLoading && (
                        <Text>No bills found</Text>
                    )}
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={bills.isFetching}
                                onRefresh={bills.refetch}
                            />
                        }
                        contentContainerStyle={styles.listContainer}
                        style={styles.list}
                        data={bills.data}
                        overScrollMode="never"
                        fadingEdgeLength={50}
                        renderItem={({item}) => (
                            <HistoryCard bill={item} navigation={navigation} />
                        )}
                    />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Earnings;
