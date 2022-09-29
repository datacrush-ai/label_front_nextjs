import { createSlice } from '@reduxjs/toolkit';
import * as _ from "lodash";

const initialState = {
    subtitleReplace: []
};

const subtitleReplaceSlice = createSlice({
    name: 'subtitleReplace',
    initialState,
    reducers: {
        setSubtitleReplace: (state, action) => {
            if (action.payload.subtitleReplace.length == null || action.payload.subtitleReplace.length == undefined) {
                state.subtitleReplace = [...state.subtitleReplace, action.payload.subtitleReplace];
            }
            else {
                state.subtitleReplace = action.payload.subtitleReplace;
            }
        },
    }
});

export const getSubtitleReplace = ((state) => {
    let result = [];
    state.commonStore.subtitleReplaceSlice.subtitleReplace.map((arr, idx) => {
        result.push({
            'subSnm': parseInt(arr.subSnm),
            'subCn': arr.subCn,
        });
    });

    return _.sortBy(result, ['subBgnHrMs', 'subEndHrMs']);
});
export const { setSubtitleReplace } = subtitleReplaceSlice.actions; //액션 생성 함수

export default subtitleReplaceSlice.reducer; //리듀서