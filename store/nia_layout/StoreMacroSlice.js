import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    macro: {
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '8': ''
    }
};

const macroSlice = createSlice({
    name: 'macro',
    initialState,
    reducers: {
        setMacro: (state, action) => {
            state.macro = action.payload.macro;
        },
    }
});

export const getMacro = ((state) => {
    return state?.layoutStore?.macroSlice?.macro;
});

export const { setMacro } = macroSlice.actions; //액션 생성 함수

export default macroSlice.reducer; //리듀서