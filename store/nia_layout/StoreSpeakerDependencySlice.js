import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    speakerDependency: [ {memo: '', speaker: '', ageidx: 0, sexidx: 0} ]
};

const speakerDependencySlice = createSlice({
    name: 'speakerDependency',
    initialState,
    reducers: {
        setspeakerDependency: (state, action) => {
            state.speakerDependency = action.payload.speakerDependency;
        },
    }
});

export const getspeakerDependency = ((state) => {
    return state?.layoutStore?.speakerDependencySlice?.speakerDependency;
});

export const { setspeakerDependency } = speakerDependencySlice.actions; //액션 생성 함수

export default speakerDependencySlice.reducer; //리듀서