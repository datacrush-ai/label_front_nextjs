import { createSlice } from '@reduxjs/toolkit';
import * as _ from "lodash";

const initialState = {
    checkSubtitle: ''
};

const checkSubtitleSlice = createSlice({
    name: 'checkSubtitle',
    initialState,
    reducers: {
        setcheckSubtitle: (state, action) => {
            action.payload = action.payload.replaceAll("class='violet_text", "style='color: #b22af8;'")
            .replaceAll("class='red_text", "style='color: #ff5757;'")
            .replaceAll("class='green_text", "style='color: #02c73c;'")
            .replaceAll("class='blue_text", "style='color: #2facea;'");
            state.checkSubtitle = action.payload;
        },
    }
});

export const getcheckSubtitle = ((state) => {
    return state.commonStore.checkSubtitleSlice.checkSubtitle;
});
export const { setcheckSubtitle } = checkSubtitleSlice.actions; //액션 생성 함수

export default checkSubtitleSlice.reducer; //리듀서