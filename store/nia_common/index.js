import { combineReducers } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import feedbackSlice from './StoreFeedback';
import subtitleReplaceSlice from './StoreSubtitleReplace';
import checkSubtitleSlice from './StoreCheckSubtitle';
import processDetailSlice from './StoreProcessDetail';
import detailListSlice from './StoreDetailList';
import uuidSlice from './StoreUUID'

const commonReducer = (state, action) => {
    //SSR작업 수행 시 HYDRATE라는 액션을 통해서 서버의 스토어와 클라이언트의 스토어를 합쳐주는 작업을 수행한다.
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload
        };
    }

    // const layout_root_reducer = combineReducers({
    //     cueSlice
    // })(state, action);

    // console.log('!!!!!!!!!!!')
    // console.log(state);
    // console.log(action);
    // console.log('@@@@@@@@@@@')

    return combineReducers({
        // 여기에 추가 
        feedbackSlice,
        subtitleReplaceSlice,
        checkSubtitleSlice,
        processDetailSlice,
        detailListSlice,
        uuidSlice,
    })(state, action);

}


export default commonReducer; // _app.js에서 reducer로 사용된다!