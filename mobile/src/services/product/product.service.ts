import axios from 'axios';
import {Product} from '../../types/product';
import {setAxiosBaseUrlFromSettings} from '../api';

function setBaseUrl() {
    setAxiosBaseUrlFromSettings();
}

export async function getProducts(): Promise<Product[]> {
    setBaseUrl();

    try {
        const response = await axios.get<Product[]>('/products');

        if (response.status === 200) {
            // Convert "_id" to "id"
            let products: Product[] = [];
            response.data.forEach(product => {
                // @ts-ignore
                product.id = product._id;
                // @ts-ignore
                delete product._id;
                products.push(product);
            });
            return products;
        } else {
            throw new Error(
                `Get products failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the get products process: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function getProductById(token: string, product_id: string) {
    setBaseUrl();

    try {
        const response = await axios.get<Product>(`/products/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 201) {
            // @ts-ignore
            response.data.id = response.data._id;
            // @ts-ignore
            delete response.data._id;
            return response.data;
        } else {
            throw new Error(
                `Get product by id failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the get product: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function createProduct(
    token: string,
    product: Product,
): Promise<Product> {
    setBaseUrl();

    try {
        const response = await axios.post<Product>(
            '/products/create',
            product,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (response.status === 200 || response.status === 201) {
            // @ts-ignore
            response.data.id = response.data._id;
            // @ts-ignore
            delete response.data._id;
            return response.data;
        } else {
            throw new Error(
                `Create product failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the create product process: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}

export async function deleteProduct(
    token: string,
    product_id: string,
): Promise<boolean> {
    setBaseUrl();

    try {
        const response = await axios.delete(`/products/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 201) {
            return true;
        } else {
            throw new Error(
                `Delete product failed with status code: ${response.status}`,
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `An error occurred during the delete product process: ${error.message}`,
            );
        } else {
            throw new Error(`An unexpected error occurred: ${error}`);
        }
    }
}
