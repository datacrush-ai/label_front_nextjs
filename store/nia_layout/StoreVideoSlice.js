import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    video_current_time: 0,
};

const videoSlice = createSlice({
    name: 'current_time',
    initialState,
    reducers: {
        setVideoCurrentTime: (state, action) => {
            state.video_current_time = action.payload;
        },
    }
});

export const getVideoCurrentTime = (state) => {
    return state.layoutStore.videoSlice.video_current_time;
};

export const { setVideoCurrentTime } = videoSlice.actions; //액션 생성 함수
export default videoSlice.reducer; //리듀서