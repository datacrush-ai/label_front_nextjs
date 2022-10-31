import { getCookies } from "cookies-next";
import { isNumber } from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCue } from "../../store/nia_layout/StoreCueSlice";
import { createCueFunc, getCueFunc, getSectionElement } from "./subtitle";
import { getAgeCurrentElement, getOvrVocCurrentElement, getPlaceCurrentElement, getSelectIndex, getSexCurrentElement, getTmpJSON, getVidElement } from "./video_layout";

let _subtitle_children; 
let _sectionEndtime;
let _sectionStartTime;
let saveAction;
let last_click_dom;
let last_copy_subtileSelLabelInfo;

export const sendFetch = async(context, param, options) => {
    const url = 'https://' + process.env.NEXT_PUBLIC_API_HOST + context;
    // const url = 'https://datacrush.asuscomm.com:30000' + context;
    let result = {'message': 'fail'};
    
    if( param ) {
        result = await fetch(url, {
            credentials: 'include',
            headers: { 
            'Content-Type': options.type || 'application/json',
            },
            body: JSON.stringify(param),
            method: options.method || 'POST',
        })
        .then( response => response.json());
    }
    else {
        result = await fetch(url, {
            credentials: 'include',
            headers: { 
            'Content-Type': options.type || 'application/json',
            },
            method: options.method || 'GET',
        })
        .then( response => response.json());
    }

    return result;
};

export const getCookieToDecode = (data) => {
    return decodeURIComponent(getCookies(data));
}
export const createPlaySectionEndTime = (data) => {
    _sectionEndtime = data
}
export const getPlaySectionEndTime = () => {
    return _sectionEndtime;
}

export const createPlaySectionStartTime = (data) => {
    _sectionStartTime = data
}
export const getPlaySectionStartTime = () => {
    return _sectionStartTime;
}

export function setSubtitleChildren(data) {
    _subtitle_children = data;
}
export function getSubtitleChildren() {
    return _subtitle_children;
}
export const createVideoCurrentTime = (data) => {
    getVidElement().current.currentTime = data;
    createPlaySectionStartTime(data);
}
export const subtitleSectionElementClick = (e) => {
    let _target = e.target;
    let _startTime = -1;
    let _endTime = 0;
    if( e.target.nodeName == 'DIV') {
        if( e.target.parentElement.nodeName == 'SECTION' && (e.target.parentElement.id != '' || e.target.parentElement.id != undefined || e.target.parentElement.id != null)) {
            e.target = e.target.parentElement;
        }
        else if( e.target.parentElement.parentElement.nodeName == 'SECTION' && (e.target.parentElement.parentElement.id != '' || e.target.parentElement.parentElement.id != undefined || e.target.parentElement.parentElement.id != null)) {
            e.target = e.target.parentElement.parentElement;
        }
        else if( e.target.parentElement.parentElement.parentElement.nodeName == 'SECTION' && (e.target.parentElement.parentElement.parentElement.id != '' || e.target.parentElement.parentElement.parentElement.id != undefined || e.target.parentElement.parentElement.parentElement.id != null)) {
            e.target = e.target.parentElement.parentElement.parentElement;
        }
    }
    if (e.target.nodeName != 'TEXTAREA') {
        while (_target.nodeName != 'SECTION') {
            _target = _target.parentElement;
        }
        _startTime = _target.id.split('_')[1];
        _endTime = _target.id.split('_')[2];
        createPlaySectionStartTime(_startTime);
        // createPlaySectionEndTime(_endTime);
        createPlaySectionEndTime(9999999)
    }

    if (getPlaySectionStartTime() > 0 || getVidElement().current.currentTime > getPlaySectionEndTime()) {
        createVideoCurrentTime(getPlaySectionStartTime());
    }
}

export const readableTimeToMilTime = (readable_time) => {
    let split_time = readable_time.split(':');
    let hour = split_time[0] * 3600000;
    let min = split_time[1] * 60000;
    let sec = split_time[2] * 1000;
    return parseFloat((hour + min + sec).toFixed(0)) / 1000;
    // console.log(hour)
    // console.log(min)
    // console.log(sec)
    // console.log(split_time)
    // console.log(split_time.length)
    // return parseFloat(parseFloat(readable_time.replaceAll(':', '')) * 1000).toFixed(0);
}

export const getUtilDate = (d) => {
    let paramDate = new Date(d); // new Date('2021-06-08'): 화요일
    let paramMonthDate = new Date(d);
    let paramMondayDate = new Date(d);
    let paramSundayDate = new Date(d);
    let paramLastMondayDate = new Date(d);
    let paramLastSundayDate = new Date(d);

    let day = paramDate.getDay();
    let diff = paramDate.getDate() - day + (day == 0 ? -6 : 1);
    let nextSunday = paramDate.getDate() + 7 - day;
    let result = {
        'firstday': `${new Date(paramMonthDate.setDate(diff)).toISOString().substring(0, 7)}-01`,
        'lastday': `${new Date(paramMonthDate.setDate(diff)).toISOString().substring(0, 7)}-31`,
        'month' : new Date(paramMonthDate.setDate(diff)).toISOString().substring(5, 7),
        'monday' : new Date(paramMondayDate.setDate(diff)).toISOString().substring(0, 10),
        'sunday' : new Date(paramSundayDate.setDate(nextSunday)).toISOString().substring(0, 10),
        'yesterday' : new Date(new Date().setDate(new Date().getDate()-1)).toISOString().substring(0,10),
        'lastmonday' : new Date(paramLastMondayDate.setDate(diff-7)).toISOString().substring(0,10),
        'lastsunday' : new Date(paramLastSundayDate.setDate(diff-1)).toISOString().substring(0,10),
    }
    return result;
}

// readableTimeToMilTime('00:00:12.00')

export const humanReadableTime = function (seconds) {
    seconds = seconds / 1000;
    // if (seconds < 60000) {
    //     let fix = Math.fround(addZero(seconds)).toFixed(2).toString();
    //     if (fix.length <= 4) {
    //         return '00:00:0' + Math.fround(addZero(seconds)).toFixed(2);
    //     }
    //     return '00:00:' + Math.fround(addZero(seconds)).toFixed(2);
    // }
    // if (seconds < 3600000) {
    //     let min = Math.floor(seconds / 60000);
    //     let sec = Math.fround(seconds - min * 60000).toFixed(2);
    //     return '00:' + addZero(min) + ':' + addZero(sec);
    // }
    // let hours = Math.floor(seconds / 3600000);
    // let min = Math.floor((seconds - hours * 3600000) / 60000);
    // let sec = Math.fround(seconds - hours * 3600000 - min * 60000).toFixed(2);
    // return addZero(hours) + ':' + addZero(min) + ':' + addZero(sec);

    // /*
    if (seconds < 60.0) {
        let fix = Math.fround(addZero(seconds)).toFixed(2).toString();
        if (fix.length <= 4) {
            return '00:00:0' + Math.fround(addZero(seconds)).toFixed(2);
        }
        return '00:00:' + Math.fround(addZero(seconds)).toFixed(2);
    }
    if (seconds < 3600.0) {
        let min = Math.floor(seconds / 60);
        let sec = Math.fround(seconds - min * 60).toFixed(2);
        return '00:' + addZero(min) + ':' + addZero(sec);
    }
    let hours = Math.floor(seconds / 3600);
    let min = Math.floor((seconds - hours * 3600) / 60);
    let sec = Math.fround(seconds - hours * 3600 - min * 60).toFixed(2);
    return addZero(hours) + ':' + addZero(min) + ':' + addZero(sec);
    // */
};

export function addZero(num) {
    return ((num < 10) ? '0' : '') + num;
    // return ((num < 10000) ? '0' : '') + num;
};

export const ToastMsg = (text, duration, clickCallback, callback, color) => {
    let background = color || "linear-gradient(to right, #00b09b, #96c93d)";
    if (color == 'warn') {
        background = 'linear-gradient(to right, #b0004b, #c93d3d)'
    }
    else if (color == 'alert') {
        background = 'linear-gradient(to right, #f4d319, #cb7c22)'
    }
    else if (color == 'pass') {
        background = 'linear-gradient(to right, #00aab0, #3d64c9)'
    }
    if (duration == undefined || duration == null) {
        duration = 3000;
    }
    Toastify({
        text: text,
        duration: duration,
        // destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            // background: "linear-gradient(to right, #00b09b, #96c93d)",
            background: background,
        },
        onClick: clickCallback, // Callback after click
        callback: callback,
    }).showToast();
};

export default function CommonScript({url}) {
    // const cue = useSelector(getCue);
    const dispatch = useDispatch();
    
    useEffect(() => {
        
        const saveSubtitle = () => {
            setTimeout(() => {
                const cue = getCueFunc();
                let _cue = document.querySelectorAll('textarea');
                let result = [];
                for(let idx=0; idx<_cue.length; idx++) {
                    let subCn = _cue[idx].value;
                    let subSnm = cue[idx].subSnm;
                    let bgn_time = cue[idx].subBgnHrMs;
                    let end_time = cue[idx].subEndHrMs;
                    // console.log(subCn)
                    result.push({
                        'subSnm': subSnm,
                        'subBgnHrMs': bgn_time,
                        'subEndHrMs': end_time,
                        'subCn': subCn,
                        'subtileSelLabelInfo': {
                            'speakerAge': {
                                'labelCd': cue[idx].subtileSelLabelInfo.speakerAge.labelCd,
                                'labelNm': cue[idx].subtileSelLabelInfo.speakerAge.labelNm,
                            },
                            'speakerSex': {
                                'labelCd': cue[idx].subtileSelLabelInfo.speakerSex.labelCd, 
                                'labelNm': cue[idx].subtileSelLabelInfo.speakerSex.labelNm,
                            },
                            'placeType': {
                                'labelCd': cue[idx].subtileSelLabelInfo.placeType.labelCd,
                                'labelNm': cue[idx].subtileSelLabelInfo.placeType.labelNm,
                            },
                            'speakerOvrVoc': {
                                'labelCd': cue[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd,
                                'labelNm': cue[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm,
                            },
                            'speaker': {
                                'labelCd': cue[idx].subtileSelLabelInfo.speaker.labelCd,
                                'labelNm': cue[idx].subtileSelLabelInfo.speaker.labelNm,
                            }
                        }
                    });
                    
                }
                const tmpJSON = getTmpJSON();
                // tmpJSON.scenarioSelLabelInfo = getScenarioSelLabelInfo();
                tmpJSON.subtitleList = result;
                dispatch(setCue({'cue': result}))
                // localStorage.setItem(getUniqeId(), JSON.stringify(result));
                sendFetch('/labeltool/tmpSaveLabelJob', tmpJSON, {method: 'POST'})
                // console.log(tmpJSON)
                ToastMsg('작업을 저장 했습니다.', 3000, null, null, 'pass');
            }, 200);
        }
        
        const exist_video_dom = document.querySelectorAll('video').length;
        saveAction = _.debounce(saveSubtitle, 500);

        document.addEventListener('click', async function (e) {
            if(e.target.nodeName == 'VIDEO') {
                last_click_dom = e.target.nodeName;
            }
        });

        if( exist_video_dom ) {
            document.addEventListener('keydown', async function (e) {
                const nextid = e.target?.nextElementSibling?.id;
                const cue = getCueFunc();
                // console.log(cue[getSelectIndex()].subtileSelLabelInfo.speakerAge);
                // console.log(cue[getSelectIndex()].subtileSelLabelInfo.speakerSex);
                // console.log(cue[getSelectIndex()].subtileSelLabelInfo.placeType);

                if( getAgeCurrentElement() != undefined && getSexCurrentElement() != undefined && getPlaceCurrentElement() != undefined 
                    && !(nextid?.includes('comment') || nextid?.includes('speaker')) ) {
                    if( e.key == '1' || e.key == '2' || e.key == '3') {
                        getAgeCurrentElement().selectedIndex = e.key;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelCd = getAgeCurrentElement().options[getAgeCurrentElement().selectedIndex].value;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelNm = getAgeCurrentElement().options[getAgeCurrentElement().selectedIndex].textContent;
                    }
                    else if( e.key == 'q' || e.key == 'w' || e.key == 'e') {
                        const convertKey = {
                            'q': 1,
                            'w': 2,
                            'e': 3,
                        };
                        getSexCurrentElement().selectedIndex = convertKey[e.key];
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelCd = getSexCurrentElement().options[getSexCurrentElement().selectedIndex].value;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelNm = getSexCurrentElement().options[getSexCurrentElement().selectedIndex].textContent;
                    }
                    else if( e.key == 'a' || e.key == 's' || e.key == 'd' || e.key == 'f' || e.key == 'g' || e.key == 'h' || e.key == 'j') {
                        let key = '';
                        let value = '';
                        const convertKey = {
                            'a': getTmpJSON().subtitleLabelInfo.placeType[1].labelNm,
                            's': getTmpJSON().subtitleLabelInfo.placeType[2].labelNm,
                            'd': getTmpJSON().subtitleLabelInfo.placeType[3].labelNm,
                            'f': getTmpJSON().subtitleLabelInfo.placeType[4].labelNm,
                            'g': getTmpJSON().subtitleLabelInfo.placeType[5].labelNm,
                            'h': getTmpJSON().subtitleLabelInfo.placeType[6].labelNm,
                            'j': getTmpJSON().subtitleLabelInfo.placeType[7].labelNm,
                        };
                        const convertValue = {
                            'a': getTmpJSON().subtitleLabelInfo.placeType[1].labelCd,
                            's': getTmpJSON().subtitleLabelInfo.placeType[2].labelCd,
                            'd': getTmpJSON().subtitleLabelInfo.placeType[3].labelCd,
                            'f': getTmpJSON().subtitleLabelInfo.placeType[4].labelCd,
                            'g': getTmpJSON().subtitleLabelInfo.placeType[5].labelCd,
                            'h': getTmpJSON().subtitleLabelInfo.placeType[6].labelCd,
                            'j': getTmpJSON().subtitleLabelInfo.placeType[7].labelCd,
                        };
                        
                        key = convertKey[e.key];
                        value = convertValue[e.key];
                        
                        if( key == undefined && value == undefined ) {
                            key = getTmpJSON().subtitleLabelInfo.placeType[0].labelNm;
                            value = getTmpJSON().subtitleLabelInfo.placeType[0].labelCd;
                        }
                        getPlaceCurrentElement().children[0].value = key;
                        cue[getSelectIndex()].subtileSelLabelInfo.placeType.labelCd = value;
                        cue[getSelectIndex()].subtileSelLabelInfo.placeType.labelNm = getPlaceCurrentElement().children[0].value;
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if (e.key == '7' || e.key == '8' || e.key == '9' || e.key == '0') {
                        const convertKey = {
                            '7': 0,
                            '8': 1,
                            '9': 2,
                            '0': 3,
                        };
                        getOvrVocCurrentElement().selectedIndex = convertKey[e.key];
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerOvrVoc.labelCd = getOvrVocCurrentElement().options[getOvrVocCurrentElement().selectedIndex].value;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerOvrVoc.labelNm = getOvrVocCurrentElement().options[getOvrVocCurrentElement().selectedIndex].textContent;

                    }
                    else if (e.key == 'c') {
                        // debugger
                        last_copy_subtileSelLabelInfo = cue[getSelectIndex()].subtileSelLabelInfo;
                        if( last_copy_subtileSelLabelInfo.speakerOvrVoc.labelCd == 'LBL_KND_00_000' ) {
                            last_copy_subtileSelLabelInfo.speakerOvrVoc.labelCd = 'LBL_KND_24_001';
                        }
                        ToastMsg(`${getSelectIndex()+1}라인 라벨을 복사 했습니다.`, 1500, null, null, 'pass');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if (e.key == 'v') {
                        cue[getSelectIndex()].subtileSelLabelInfo = last_copy_subtileSelLabelInfo;
                        const paste_target = document.querySelector('#subtitle_edit_layout').children[0].children[getSelectIndex()].children[0].children[0];
                        //발화자 연령
                        paste_target.children[3].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelCd;
                        //성별
                        paste_target.children[4].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelCd;
                        //장소
                        paste_target.children[5].children[1].children[0].value = cue[getSelectIndex()].subtileSelLabelInfo.placeType.labelNm;
                        //화자
                        paste_target.children[6].children[1].children[0].value = cue[getSelectIndex()].subtileSelLabelInfo.speaker.labelNm;
                        //중첩음
                        paste_target.children[7].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerOvrVoc.labelCd;
    
                        setTimeout(function() { 
                            dispatch(setCue({'cue': cue}));
                        }, 100)
    
                        ToastMsg(`${getSelectIndex()+1}라인 라벨에 붙여넣기 했습니다.`, 1500, null, null, 'pass');
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    createCueFunc(cue);
                }
                


                //MAC
                // if( navigator.platform.toUpperCase().indexOf('MAC') != -1 ) {
                if (e.ctrlKey && e.key == ',') {
                    //배속 감소
                    let playback = parseFloat((parseFloat(getVidElement().current.playbackRate)-0.1).toFixed(1));
                    if (isNumber(playback)) {
                        getVidElement().current.playbackRate = playback;
                        ToastMsg(`${playback}배속으로 감소합니다.`, 1000, null, null, 'warn');
                    }
                }
                else if (e.ctrlKey && e.key == '.') {
                    //배속 증가
                    let playback = parseFloat((parseFloat(getVidElement().current.playbackRate)+0.1).toFixed(1));
                    if (isNumber(playback)) {
                        getVidElement().current.playbackRate = playback;
                        ToastMsg(`${playback}배속으로 증가합니다.`, 1000, null, null, 'pass');
                    }
                }
                else if (e.shiftKey && e.key == 'Enter') {
                    // if (e.target.nodeName == 'TEXTAREA') {
                    //     idxFromSaveFocus = e.target.id;
                    // }
                    // setIsCurrentUpdate(false);
                    saveAction();
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if (e.key == ']' || e.key == '\\' || e.key == '|') {
                    let isPlaying = getVidElement().current.currentTime > 0 && !getVidElement().current.paused && !getVidElement().current.ended && getVidElement().current.readyState > getVidElement().current.HAVE_CURRENT_DATA;
                    createPlaySectionEndTime(9999999);
                    if (!isPlaying) {
                        //영상 재생
                        getVidElement().current.play();
                    }
                    else {
                        //영상 정지
                        getVidElement().current.pause();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if (e.key == 'ArrowRight' && last_click_dom == 'VIDEO') {
                    createVideoCurrentTime(getVidElement().current.currentTime + 0.5);
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if (e.key == 'ArrowLeft' && last_click_dom == 'VIDEO') {
                    createVideoCurrentTime(getVidElement().current.currentTime - 0.5);
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

    }, [dispatch])
    return(
        <>
        </>
    )
}