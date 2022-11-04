import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    video_duration: 0,
};

const videoSlice = createSlice({
    name: 'video_duration',
    initialState,
    reducers: {
        setVideoDuration: (state, action) => {
            state.video_duration = action.payload;
        },
    }
});

export const getVideoDuration = (state) => {
    return state.layoutStore.videoSlice.video_duration.video_duration;
};

export const { setVideoDuration } = videoSlice.actions; //액션 생성 함수
export default videoSlice.reducer; //리듀서