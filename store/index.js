import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";
import layoutReducer from './nia_layout';
import commonReducer from './nia_common';

/*
스토어를 생성하는 함수를 정의하고, 이를 인자로 wrapper HOC를 만든다.
configureStore: store를 생성한다.
redux-toolkit은 devTools 등의 미들웨어들을 기본적으로 제공한다. 여기에 사용하고 싶은 미들웨어가 있다면 추가로 정의해준다.
위의 코드에선 logger를 추가해줬다.
createWrapper: wrapper를 생성한다.
지금까지 리듀서 모듈 만들기 -> 리듀서 모듈 합치기 -> 스토어 생성의 과정을 거쳤다.
이제 최종적으로 wrapper에 스토어를 바인딩해주면 된다.

충처 : https://cotak.tistory.com/164
*/
const makeStore = (context) => configureStore({
    reducer: {
        layoutStore: layoutReducer,
        commonStore: commonReducer,
    },
    // middleware: getDefaultMiddleware({
    //     serializableCheck: false,
    // }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(), 
    // middleware: (getDefaultMiddleware) => [getDefaultMiddleware().concat({serializableCheck: false})], 
    // devTools: process.env.NODE_ENV !== 'production',
});

export const wrapper = createWrapper(makeStore, {
    // debug: process.env.NODE_ENV !== 'production',
});