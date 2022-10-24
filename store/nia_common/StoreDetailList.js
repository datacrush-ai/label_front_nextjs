import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    'epListPerPrg': [{
        'prgAin': '', 
        'epAin': '', 
        'epNm': '', 
        'epVdoSnm': '', 
        'filePath': ''
    }]
};

const detailListSlice = createSlice({
    name: 'detail_list',
    initialState,
    reducers: {
        setDetailList: (state, action) => {
            state.epListPerPrg = action.payload?.map((arr, idx) => {
                if(arr.filePath == null || arr.filePath == undefined || arr.filePath.indexOf('https') != -1) {
                    arr.filePath = '/M4.jpeg';
                }
                return arr;
            });
        },
    }
});

export const getDetailList = (state) => {
    // console.log(state.commonStore.detailListSlice)
    return state.commonStore.detailListSlice;
};

export const { setDetailList } = detailListSlice.actions; //액션 생성 함수
export default detailListSlice.reducer; //리듀서