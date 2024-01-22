import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import settingsReducer from './settings/settingsSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        settings: settingsReducer,
        user: userReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
