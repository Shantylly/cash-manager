import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {User} from '../../types/user';

const initialState: User = {
    access_token: '',
    id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    balance: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        accessTokenChanged: (state, action: PayloadAction<string>) => {
            state.access_token = action.payload;
        },
        userProfileChanged: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.balance = action.payload.balance;
        },
    },
});

export const {accessTokenChanged, userProfileChanged} = userSlice.actions;
export default userSlice.reducer;

export const selectUser = createSelector(
    [(state: {user: User}) => state.user],
    user => user,
);
