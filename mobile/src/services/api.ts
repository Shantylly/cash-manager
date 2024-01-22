import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {store} from '../stores/store';

export const queryClient = new QueryClient();

function getBaseUrl() {
    const currentState = store.getState();
    const settingsState = currentState.settings;

    return settingsState.serverUrl;
}
export function setAxiosBaseUrl(url: string) {
    axios.defaults.baseURL = url;
}

export function setAxiosBaseUrlFromSettings() {
    const baseUrl = getBaseUrl();
    axios.defaults.baseURL = baseUrl;
}
