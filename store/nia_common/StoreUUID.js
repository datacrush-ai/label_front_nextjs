import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    'X-nia-id': 'default',
};

const uuidSlice = createSlice({
    name: 'X-nia-id',
    initialState,
    reducers: {
        setuuid: (state, action) => {
            state['X-nia-id'] = action.payload;
        },
    }
});

export const getuuid = ((state) => {
    return state.commonStore.uuidSlice['X-nia-id'];
});
export const { setuuid } = uuidSlice.actions; //액션 생성 함수

export default uuidSlice.reducer; //리듀서