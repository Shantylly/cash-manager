import {ImageSourcePropType} from 'react-native';

export type Product = {
    id: string;
    name: string;
    description: string;
    photo: ImageSourcePropType;
    price: number;
    seller_id: string;
};

export type ProductQuantity = {
    product: Product;
    quantity: number;
};
