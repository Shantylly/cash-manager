import axios from 'axios';
import {Bill} from '../../types/bill';
import {setAxiosBaseUrlFromSettings} from '../api';

type CreateBillResponse = {
    bill: Bill;
    message: string;
};

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function createBill(
    token: string,
    user_id: string,
    products: string[],
): Promise<Bill> {
    setBaseUrl();

    try {
        const response = await axios.post<CreateBillResponse>(
            '/bills/create',
            {
                user_id: user_id,
                type: 'NFC',
                products: products,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (response.status === 200 || response.status === 201) {
            let bill: Bill = {
                // @ts-ignore
                id: response.data.bill._id,
                amount: response.data.bill.amount,
                products: response.data.bill.products,
                status: response.data.bill.status,
                timestamp: response.data.bill.timestamp,
                type: response.data.bill.type,
                user_id: response.data.bill.user_id,
            };
            return bill;
        } else {
            throw new Error(
                `Create bill failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the create bill process: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function getBillsByUser(token: string, user_id: string) {
    setBaseUrl();

    try {
        const response = await axios.get<Bill[]>(`/bills/user/${user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 201) {
            let bills: Bill[] = [];
            response.data.forEach(bill => {
                bills.push({
                    // @ts-ignore
                    id: bill._id,
                    amount: bill.amount,
                    products: bill.products,
                    status: bill.status,
                    timestamp: bill.timestamp,
                    type: bill.type,
                    user_id: bill.user_id,
                });
            });
            return bills;
        } else {
            throw new Error(
                `Get bills by user failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the get bills: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function getBill(token: string, bill_id: string) {
    setBaseUrl();

    try {
        const response = await axios.get<Bill>(`/bills/${bill_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 201) {
            let bill: Bill = {
                // @ts-ignore
                id: response.data._id,
                amount: response.data.amount,
                products: response.data.products,
                status: response.data.status,
                timestamp: response.data.timestamp,
                type: response.data.type,
                user_id: response.data.user_id,
            };
            return bill;
        } else {
            throw new Error(
                `Get bill failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the get bill: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}
