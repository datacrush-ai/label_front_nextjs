import { createSlice } from '@reduxjs/toolkit';
import * as _ from "lodash";

const initialState = {
    cue: [{
        'subSnm': '1',
        'subBgnHrMs': 0,
        'subEndHrMs': 0,
        'subCn': '',
        'subtileSelLabelInfo': {
            'speakerAge': {
                'labelCd': "",
                'labelNm': ""
            },
            'speakerSex': {
                'labelCd': '', 
                'labelNm': ''
            },
            'placeType': {
                'labelCd': '', 
                'labelNm': ''
            },
            'speakerOvrVoc': {
                'labelCd': '', 
                'labelNm': ''
            },
            'speaker': {
                'labelCd': '', 
                'labelNm': ''
            }
        }
    }],
    
};

const cueSlice = createSlice({
    name: 'cue',
    initialState,
    reducers: {
        setCue: (state, action) => {
            // action.payload.cue = _.sortBy(action.payload.cue, ['startTime', 'endTime']);
            state.cue = action.payload.cue;
        },
    }
});

export const getCue = ((state) => {
    let result = [];
    state.layoutStore.cueSlice.cue.map((arr, idx) => {
        result.push({
            'subSnm': idx,
            'subBgnHrMs': parseFloat(arr.subBgnHrMs),
            'subEndHrMs': parseFloat(arr.subEndHrMs),
            'subCn': arr.subCn,
            'subtileSelLabelInfo': {
                'speakerAge': {
                    'labelCd': arr.subtileSelLabelInfo.speakerAge?.labelCd,
                    'labelNm': arr.subtileSelLabelInfo.speakerAge?.labelNm,
                },
                'speakerSex': {
                    'labelCd': arr.subtileSelLabelInfo.speakerSex?.labelCd,
                    'labelNm': arr.subtileSelLabelInfo.speakerSex?.labelNm
                },
                'placeType': {
                    'labelCd': arr.subtileSelLabelInfo.placeType?.labelCd,
                    'labelNm': arr.subtileSelLabelInfo.placeType?.labelNm
                },
                'speakerOvrVoc': {
                    'labelCd': arr.subtileSelLabelInfo.speakerOvrVoc?.labelCd,
                    'labelNm': arr.subtileSelLabelInfo.speakerOvrVoc?.labelNm
                },
                'speaker': {
                    'labelCd': arr.subtileSelLabelInfo.speaker?.labelCd,
                    'labelNm': arr.subtileSelLabelInfo.speaker?.labelNm
                },
            }
        });
    });
    result = _.uniqBy(result, 'subBgnHrMs', 'subEndHrMs');
    return _.sortBy(result, ['subBgnHrMs', 'subEndHrMs']);
});
export const { setCue, saveServerCue } = cueSlice.actions; //액션 생성 함수

export default cueSlice.reducer; //리듀서