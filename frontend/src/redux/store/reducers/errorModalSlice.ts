import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
    type?: 'axios'
    open: boolean
    error?: {
        status: number
        message: string
    }
}
const initialState: IInitialState = {
    open: false,
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        openErrorModal: (state, action) => {
            state.open = true;
            if (action.payload) {
                state.error = { ...action.payload };
            }
        },
        closeErrorModal: (state) => {
            state.open = initialState.open;
            state.error = initialState.error
        },
    },
});

export const { openErrorModal, closeErrorModal } = chatSlice.actions;

export default chatSlice.reducer;