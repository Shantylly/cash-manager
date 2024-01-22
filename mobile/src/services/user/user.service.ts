import axios from 'axios';
import {User} from '../../types/user';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function getProfile(token: string): Promise<User> {
    setBaseUrl();

    try {
        const response = await axios.get<User>('/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            let user: User = {
                access_token: token,
                // @ts-ignore
                id: response.data._id,
                username: response.data.username,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                balance: response.data.balance,
            };
            return user;
        } else {
            throw new Error(
                `Get profile failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the get profile process: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function userPayment(token: string, billId: string) {
    setBaseUrl();

    try {
        const response = await axios.post<any>(
            '/users/payment',
            {
                billId: billId,
                type: 'NFC',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `Get profile failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}
