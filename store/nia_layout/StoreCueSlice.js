import { createSlice } from '@reduxjs/toolkit';
import * as _ from "lodash";
import { getHost } from '../../config/serverconfig';
import { ToastMsg } from '../../pages/common/common_script';
import { getCueFunc } from '../../pages/common/subtitle';

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
            }
        }
        // "speakerCd": '',
        // "speakerNm": '',
        // "genderCd": '',
        // "genderNm": ''
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
        saveServerCue: async(state, action) => {
            const context = '/labeltool/reqComplLabelJob';
            const cue = getCueFunc();
            // console.log(cue)
            // console.log(cue)
            // await sendFetch(context, action.payload.cue, {method: 'POST'});
            ToastMsg(`저장하였습니다.`, 3000, null, null, 'pass');
            return await sendFetch(context, cue, {method: 'POST'})
            // .then(res => {
            //     console.log(res);
            // });
            
            // let host = 'http://116.120.27.245:30501/worklist/createSubtitle/';
            // if(process.env.NODE_ENV !== 'development') {
            //     host = 'http://vivoservernestjs-env.eba-p5f3fzvs.ap-northeast-2.elasticbeanstalk.com/worklist/createSubtitle/'
            // }
            /*
            let host = getHost();
            let param = {
                'PRG_AIN': parseInt(action.payload.PRG_AIN),
                'EP_AIN': parseInt(action.payload.EP_AIN),
                'EP_SUB_VER_SNM': parseInt(action.payload.EP_SUB_VER_SNM),
                'SUB_PRN_SNM': parseInt(action.payload.SUB_PRN_SNM),
                'SUB_PRN_SUB_JSN_SNM': parseInt(action.payload.SUB_PRN_SUB_JSN_SNM),
                'SUB_PRN_SUB_JSN': action.payload.SUB_PRN_SUB_JSN,
            }
            // console.log(param)
            state.cue = action.payload.SUB_PRN_SUB_JSN;
            fetch(`${host}/worklist/createSubtitle/`, {
                credentials: 'same-origin',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin':'*',
                },
                method: 'POST',
                body: JSON.stringify(param),
                // body: param,
                mode: 'cors' //no-cors, cors
            }).then( res => {
                ToastMsg('작업을 저장 했습니다.', 3000, null, null, 'pass');
            }).catch(e => {
                ToastMsg('작업을 저장 하지 못했습니다.', 3000, null, null, 'warn');
            })
            */
            
              
        },
    }
});

export const getCue = ((state) => {
    // console.log(state.layoutStore.cueSlice.cue);
    let result = [];
    // let _result = [];
    state.layoutStore.cueSlice.cue.map((arr, idx) => {
        result.push({
            // 'subSnm': arr.subSnm,
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
            }
        });
        // _result.push({
        //     'subSnm': arr.id,
        //     'subCn': arr.text,
        //     'subBgnHrMs': parseFloat(arr.startTime),
        //     'subEndHrMs': parseFloat(arr.endTime),
        // });
    });
    
    // console.log(JSON.stringify(_.sortBy(_result, ['subBgnHrMs', 'subEndHrMs'])));

    // console.log('getCue Call');
    result = _.uniqBy(result, 'subBgnHrMs', 'subEndHrMs');
    return _.sortBy(result, ['subBgnHrMs', 'subEndHrMs']);
    // return state.layoutStore.cueSlice.cue;
});
export const { setCue, saveServerCue } = cueSlice.actions; //액션 생성 함수

export default cueSlice.reducer; //리듀서