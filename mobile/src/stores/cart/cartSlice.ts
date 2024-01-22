import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {Product, ProductQuantity} from '../../types/product';

const initialState: Product[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        // Add a new item to the cart or increase the quantity of an existing item
        cartAdded: (state, action: PayloadAction<Product>) => {
            state.push(action.payload);
        },
        cartAddedById: (state, action: PayloadAction<string>) => {
            const index = state.findIndex(item => item.id === action.payload);
            const item = state[index];
            state.push(item);
        },
        // Remove an item from the cart or decrease the quantity of an existing item
        cartRemoved: (state, action: PayloadAction<Product>) => {
            const index = state.findIndex(
                item => item.id === action.payload.id,
            );
            state.splice(index, 1);
        },
        cartRemovedById: (state, action: PayloadAction<string>) => {
            const index = state.findIndex(item => item.id === action.payload);
            state.splice(index, 1);
        },
        // Remove all items from the cart
        cartEmptied: () => initialState,
    },
});

export const {
    cartAdded,
    cartAddedById,
    cartRemoved,
    cartRemovedById,
    cartEmptied,
} = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartTotal = createSelector(
    [(state: {cart: Product[]}) => state.cart],
    cart => cart.reduce((total, item) => total + item.price, 0),
);

export const selectCartItemsCount = createSelector(
    [(state: {cart: Product[]}) => state.cart],
    cart => cart.length,
);

export const selectCartItems = createSelector(
    [(state: {cart: Product[]}) => state.cart],
    cart => cart,
);

// use ProductQuantity instead of Product
export const selectCartItemsByQuantity = createSelector(
    [(state: {cart: Product[]}) => state.cart],
    cart => {
        const cartItems: ProductQuantity[] = [];
        cart.forEach(item => {
            const index = cartItems.findIndex(
                cartItem => cartItem.product.id === item.id,
            );
            if (index === -1) {
                cartItems.push({product: item, quantity: 1});
            } else {
                cartItems[index].quantity++;
            }
        });
        return cartItems;
    },
);
