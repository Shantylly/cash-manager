import axios from 'axios';
import {LoginPayload, LoginResponse, RegisterResponse} from '../../types/auth';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function login(
    username: string,
    password: string,
): Promise<LoginResponse> {
    setBaseUrl();

    try {
        const payload: LoginPayload = {username, password};
        const response = await axios.post<LoginResponse>(
            '/auth/login',
            payload,
        );

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `Login failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid username or password');
            } else {
                throw new Error(
                    `An error occurred during the login process: ${error.message}`,
                );
            }
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function register(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
): Promise<RegisterResponse> {
    setBaseUrl();

    try {
        const response = await axios.post<RegisterResponse>('/auth/register', {
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        });

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(
                `Register failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid username or password');
            } else {
                throw new Error(
                    `An error occurred during the register process: ${error.message}`,
                );
            }
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}
