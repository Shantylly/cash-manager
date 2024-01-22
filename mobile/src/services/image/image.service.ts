import axios from 'axios';
import {setAxiosBaseUrl} from '../api';
import FData from 'form-data';
import {Asset} from 'react-native-image-picker';

function setBaseUrl() {
    setAxiosBaseUrl('https://api.imgur.com');
}

export async function uploadImage(clientId: string, asset: Asset): Promise<{}> {
    setBaseUrl();

    try {
        const data = new FData();
        data.append('image', {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
        });        

        const response = await axios.post('/3/upload', {
            headers: {
                Authorization: `Client-ID ${clientId}`,
                'Content-Type': 'multipart/form-data',
            },
            data: data,
        });

        console.log(response.data);

        return response.data;
    } catch (error) {
        console.log(error.response);

        throw error;
    }
}

