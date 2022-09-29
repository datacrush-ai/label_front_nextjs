import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    "prg_ain": "",
    "process_name": "",
    'process_list': [
        {
            'jobPrrSttsScd': "",
            'statCnt': 0,
            'statNm': "",
            'subJobScd': "",
            'sumJobScd': "",
        }
    ]
};

const processDetailSlice = createSlice({
    name: 'process_list',
    initialState,
    reducers: {
        setProcessDetail: (state, action) => {
            state.prg_ain = action.payload.prg_ain;
            state.process_name = action.payload.process_name;
            state.process_list = action.payload.process_list;
        },
    }
});

export const getProcessDetail = (state) => {
    return state.commonStore.processDetailSlice;
};

export const { setProcessDetail } = processDetailSlice.actions; //액션 생성 함수
export default processDetailSlice.reducer; //리듀서