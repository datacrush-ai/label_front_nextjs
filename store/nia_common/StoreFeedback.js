import { createSlice } from '@reduxjs/toolkit';
import * as _ from "lodash";

const initialState = {
    feedback: []
};

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        setFeedback: (state, action) => {
            if (action.payload.feedback.length == null || action.payload.feedback.length == undefined) {
                state.feedback = [...state.feedback, action.payload.feedback];
            }
            else {
                state.feedback = action.payload.feedback;
            }
        },
    }
});

export const getFeedback = ((state) => {
    let result = [];
    state.commonStore.feedbackSlice.feedback.map((arr, idx) => {
        result.push({
            'subBgnHrMs': parseFloat(arr.subBgnHrMs),
            'feedback': arr.feedback,
            'userCheck': arr.userCheck,
            'inspectCheck': arr.inspectCheck,
        });
    });

    return _.sortBy(result, ['subBgnHrMs', 'subEndHrMs']);
});
export const { setFeedback } = feedbackSlice.actions; //액션 생성 함수

export default feedbackSlice.reducer; //리듀서