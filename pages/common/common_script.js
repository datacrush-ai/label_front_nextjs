import { getCookie, getCookies, setCookie } from "cookies-next";
import _, { isNumber } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCue } from "../../store/nia_layout/StoreCueSlice";
import { getMacro, setMacro } from "../../store/nia_layout/StoreMacroSlice";
import { getFuncMacro } from "./edit";
import { convertValueKey } from "./searchbox_autocomplete";
import { createCueFunc, getCueFunc } from "./subtitle";
import { getAgeCurrentElement, getOvrVocCurrentElement, getPlaceCurrentElement, getSelectIndex, getSexCurrentElement, getTmpJSON, getVidElement } from "./video_layout";

let _subtitle_children; 
let _sectionEndtime;
let _sectionStartTime;
let saveAction;
let copyAction;
let pasteAction;
let toggleAction;
let last_click_dom;
let last_copy_subtileSelLabelInfo;
let dispatchEvent;
let _speakerDependency;

export const sendFetch = async(context, param, options) => {
    const url = 'https://' + process.env.NEXT_PUBLIC_API_HOST + context;
    // const url = 'https://datacrush.asuscomm.com:30000' + context;
    let result = {'message': 'fail'};
    
    if( param ) {
        result = await fetch(url, {
            credentials: 'include',
            headers: { 
            'Content-Type': options?.type || 'application/json',
            },
            body: JSON.stringify(param),
            method: options?.method || 'POST',
        })
        .then( response => response.json());
        // .then( response => response.json());
    }
    else {
        result = await fetch(url, {
            credentials: 'include',
            headers: { 
            'Content-Type': options?.type || 'application/json',
            },
            method: options.method || 'POST',
        })
        .then( response => response.json());
    }

    return result;
};

export const sendSwitWebHook = async(param) => {
    const worker_id = JSON.parse(getCookie('tmp'))['prtEml'];
    const swit_webhook_url = 'https://hook.swit.io/idea/221123053757352nvge/DzXBMUJc1DhnXwqadAMJ';
    if( param.text == undefined ) {
        param = {
            'text': '???????????? ?????? ??????'
        }
    };

    param.text += `\n\n?????? ????????? = ${worker_id}`;

    fetch(swit_webhook_url, {
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
        method: 'POST',
    })
}

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
export const subtitleContext = (contextmenuRef, e) => {
    contextmenuRef.current.style.setProperty('--mouse-x', e.clientX + 'px')
    contextmenuRef.current.style.setProperty('--mouse-y', e.clientY + 'px')
    contextmenuRef.current.style.display = 'block'
}
export const subtitleContextClick = (contextmenuRef, e) => {
    contextmenuRef.current.style.display = 'none';
    const macro_key = parseInt(e.target.id.split('_')[1]);
    let _cue = document.querySelectorAll('textarea');
    const cue = getCueFunc();
    const _macro = getFuncMacro();
    let _duplicate_value = false;
    let _duplicate_idx = 0;

    
    const selectParent = _cue[getSelectIndex()].parentElement.parentElement;

    const ageValue = selectParent.children[3].children[1].children[selectParent.children[3].children[1].selectedIndex].value;
    const ageText = selectParent.children[3].children[1].children[selectParent.children[3].children[1].selectedIndex].textContent;
    const sexValue = selectParent.children[4].children[1].children[selectParent.children[4].children[1].selectedIndex].value;
    const sexText = selectParent.children[4].children[1].children[selectParent.children[4].children[1].selectedIndex].textContent;
    
    let last_copy_subtileSelLabelInfo = _.cloneDeep(cue[getSelectIndex()].subtileSelLabelInfo);

    setTimeout(() => {
        last_copy_subtileSelLabelInfo.speakerAge.labelCd = ageValue;
        last_copy_subtileSelLabelInfo.speakerAge.labelNm = ageText;
        
        last_copy_subtileSelLabelInfo.speakerSex.labelNm = sexValue;
        last_copy_subtileSelLabelInfo.speakerSex.labelNm = sexText;

        if( last_copy_subtileSelLabelInfo.speakerOvrVoc.labelCd == 'LBL_KND_00_000' ) {
            last_copy_subtileSelLabelInfo.speakerOvrVoc.labelCd = 'LBL_KND_24_001';
        }
    
        if(
            last_copy_subtileSelLabelInfo?.speakerAge?.labelCd != "LBL_KND_00_000" &&
            last_copy_subtileSelLabelInfo?.speakerSex?.labelCd != "LBL_KND_00_000" &&
            last_copy_subtileSelLabelInfo?.placeType?.labelCd != "LBL_KND_00_000" &&
            last_copy_subtileSelLabelInfo?.speaker?.labelCd != "LBL_KND_00_000"
         ) {
             for(let idx=1; idx<10; idx++) {
                 if( 
                     _macro[idx]?.speakerAge?.labelCd == last_copy_subtileSelLabelInfo?.speakerAge?.labelCd &&
                     _macro[idx]?.speakerSex?.labelCd == last_copy_subtileSelLabelInfo?.speakerSex?.labelCd &&
                     _macro[idx]?.placeType?.labelCd == last_copy_subtileSelLabelInfo?.placeType?.labelCd &&
                     _macro[idx]?.speaker?.labelCd == last_copy_subtileSelLabelInfo?.speaker?.labelCd &&
                     _macro[idx]?.speakerOvrVoc?.labelCd == last_copy_subtileSelLabelInfo?.speakerOvrVoc?.labelCd
                 ) {
                     _duplicate_value = true;
                     _duplicate_idx = idx;
                     break;
                 }
             }
             if( !(_duplicate_value) ) {
                 let result = {};
                 for (const [key, value] of Object.entries(_macro)) {
                     result[key] = value;
                 }
                 result[macro_key] = last_copy_subtileSelLabelInfo;
                 dispatchEvent(setMacro({'macro': result}))
                 
                 ToastMsg(`${macro_key}??? ????????? ??????`, 1000, null, null, 'pass');
             }
             else {
                 ToastMsg(`????????? ?????? ${_duplicate_idx}??? ???????????? ???????????? ????????????.\n????????? ????????? ??? ?????? ???????????????.`, 1000, null, null, 'warn');
             }
        }
        else {
            ToastMsg(`????????? ????????? ????????? ?????? ????????? ?????? ?????? ?????? ????????? ?????????.`, 1000, null, null, 'warn');
        }
    }, 100);

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
}

export const getUtilDate = (d) => {
    let paramDate = new Date(d); // new Date('2021-06-08'): ?????????
    let paramMonthFirstDate = new Date(d);
    let paramMonthLastDate = new Date(d);
    // let paramMonthDate = new Date(d);
    let paramMondayDate = new Date(d);
    let paramSundayDate = new Date(d);
    let paramLastMondayDate = new Date(d);
    let paramLastSundayDate = new Date(d);

    let day = paramDate.getDay();
    let diff = paramDate.getDate() - day + (day == 0 ? -6 : 1);
    let nextSunday = paramDate.getDate() + 7 - day;
    let result = {
        'firstday': `${paramMonthFirstDate.toISOString().substring(0, 7)}-01`,
        'lastday': `${paramMonthLastDate.toISOString().substring(0, 7)}-31`,
        'month' : `${paramMonthLastDate.toISOString().substring(5, 7)}`,
        'lastmonth': `${new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().substring(5,7)}`,
        'monday' : new Date(paramMondayDate.setDate(diff)).toISOString().substring(0, 10),
        'sunday' : new Date(paramSundayDate.setDate(nextSunday)).toISOString().substring(0, 10),
        'yesterday' : new Date(new Date().setDate(new Date().getDate()-1)).toISOString().substring(0,10),
        'lastmonday' : new Date(paramLastMondayDate.setDate(diff-7)).toISOString().substring(0,10),
        'lastsunday' : new Date(paramLastSundayDate.setDate(diff-1)).toISOString().substring(0,10),
        'lastmonth_firstday': `${new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().substring(0,7)}-01`,
        'lastmonth_lastday': `${new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().substring(0,7)}-31`,
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

export const ToastMsg = (text, duration, clickCallback, callback, color, options) => {
    let toast_msg = text;
    let background = color || "linear-gradient(to right, #00b09b, #96c93d)";
    if( options == undefined ) {
        options = {
            'style': {
                'background': ''
            }
        };
    }
    else if( options == '??????' ) {
        toast_msg = `${text.notice?.ntcTtl}\n${text.notice?.ntcCn}`;
        callback = () => {
            if(confirm('????????? ??????????????? ?????? ??? ?????? ????????? ????????????????')){
                const alarm_param = {
                    'start': text.notice?.ntcVldBgnDt,
                    'end': text.notice?.ntcVldEndDt
                };
                localStorage.setItem('alarm', JSON.stringify(alarm_param));
            }
        }
        clickCallback = (e) => {
            window.open('http://pf.kakao.com/_atgdxj', '_blank');
        };

        options = {
            'style': {
                'padding': '10%',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'center',
                'align-items': 'center',
                'background': '',
                'top': '50%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'font-size': '1.3rem',
            },
            'offset': {
                x: '-50%',
                y: '-50%'
            },
            'gravity': 'bottom',
            'position': 'right',
        };

        if( text.notice?.ntcImgUrl == '/img/notice.png' || text.notice?.ntcImgUrl == null || text.notice?.ntcImgUrl == undefined ) {
            options["avatar"] = "/consult_large_yellow_pc.png";
        }
        else {
            options["avatar"] = text.notice?.ntcImgUrl;
        }
        
    }
    if (color == 'warn') {
        background = 'linear-gradient(to right, #b0004b, #c93d3d)'
        options.style.background = background;
    }
    else if (color == 'alert') {
        background = 'linear-gradient(to right, #f4d319, #cb7c22)'
        options.style.background = background;
    }
    else if (color == 'pass') {
        background = 'linear-gradient(to right, #00aab0, #3d64c9)'
        options.style.background = background;
    }
    if (duration == undefined || duration == null) {
        duration = 3000;
    }

    Toastify({
        text: toast_msg,
        duration: duration,
        // destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: options?.gravity ?? "bottom", // `top` or `bottom`
        position: options?.position ?? "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: options.style,
        onClick: clickCallback, // Callback after click
        callback: callback,
        avatar: options.avatar ?? '',
        offset: options.offset ?? '',
    }).showToast();
};

export default function CommonScript({url}) {
    // const cue = useSelector(getCue);
    const dispatch = useDispatch();
    const macro = useSelector(getMacro);
    dispatchEvent = dispatch;

    useEffect(() => {
        const speakerDependency = document.getElementById('speaker-dependency');
        const copyToast = () => {
            ToastMsg(`${getSelectIndex()+1}?????? ????????? ?????? ????????????.`, 500, null, null, 'pass')
        }
        const pasteToast = () => {
            ToastMsg(`${getSelectIndex()+1}?????? ????????? ???????????? ????????????.`, 500, null, null, 'pass')
        }
        
        const togglePlay = (isPlaying) => {
            if(!isPlaying) {
                //?????? ??????
                getVidElement().current.play();
            }
            else {
                //?????? ??????
                getVidElement().current.pause();
            }
        }
        
        const saveSubtitle = () => {
            setTimeout(() => {
                let result = [];
                let subtitle_edit_layout = document.querySelector('#subtitle_edit_layout').children[0];
                let subtitle_edit_layout_length = subtitle_edit_layout.childElementCount;
                for(let idx=0; idx<subtitle_edit_layout_length; idx++) {
                    let target_subtitle_component = subtitle_edit_layout.children[idx].children[0].children[0];
                    // ??????
                    let subCn = target_subtitle_component.children[2].textContent;
                    // ??????
                    let subSnm = idx;
                    // ????????????
                    let bgn_time = parseFloat(subtitle_edit_layout.children[idx].id.split('_')[1])*1000;
                    // ????????????
                    let end_time = parseFloat(subtitle_edit_layout.children[idx].id.split('_')[2])*1000;

                    //????????? ?????? value
                    let speaker_age_value = target_subtitle_component.children[3].children[1].selectedOptions[0].textContent;
                    //????????? ?????? key
                    let speaker_age_key = target_subtitle_component.children[3].children[1].selectedOptions[0].value;

                    //?????? value
                    let speaker_sex_value = target_subtitle_component.children[4].children[1].selectedOptions[0].textContent;
                    //?????? key
                    let speaker_sex_key = target_subtitle_component.children[4].children[1].selectedOptions[0].value;
                    
                    //????????? value
                    let speaker_voc_value = target_subtitle_component.children[7].children[1].selectedOptions[0].textContent;
                    //????????? key
                    let speaker_voc_key = target_subtitle_component.children[7].children[1].selectedOptions[0].value;


                    //?????? value
                    let place_value = target_subtitle_component.children[5].children[1].children[0].value;
                    //?????? key
                    let place_key = convertValueKey(place_value);
                    
                    //?????? value
                    let speaker_value = target_subtitle_component.children[6].children[1].children[0].value;
                    //?????? key
                    let speaker_key = convertValueKey(speaker_value);
                    
                    result.push({
                        'subSnm': subSnm,
                        'subBgnHrMs': bgn_time,
                        'subEndHrMs': end_time,
                        'subCn': subCn,
                        'subtileSelLabelInfo': {
                            'speakerAge': {
                                'labelCd': speaker_age_key,
                                'labelNm': speaker_age_value,
                                // 'labelCd': cue[idx].subtileSelLabelInfo.speakerAge.labelCd,
                                // 'labelNm': cue[idx].subtileSelLabelInfo.speakerAge.labelNm,
                            },
                            'speakerSex': {
                                'labelCd': speaker_sex_key, 
                                'labelNm': speaker_sex_value,
                                // 'labelCd': cue[idx].subtileSelLabelInfo.speakerSex.labelCd, 
                                // 'labelNm': cue[idx].subtileSelLabelInfo.speakerSex.labelNm,
                            },
                            'placeType': {
                                'labelCd': place_key,
                                'labelNm': place_value,
                            },
                            'speakerOvrVoc': {
                                'labelCd': speaker_voc_key,
                                'labelNm': speaker_voc_value,
                            },
                            'speaker': {
                                'labelCd': speaker_key,
                                'labelNm': speaker_value,
                            }
                        }
                    });

                    // param.subtitleList[idx].subtileSelLabelInfo.placeType.labelCd = place_key;
                    // param.subtitleList[idx].subtileSelLabelInfo.placeType.labelNm = place_value;
                    // param.subtitleList[idx].subtileSelLabelInfo.speaker.labelCd = speaker_key;
                    // param.subtitleList[idx].subtileSelLabelInfo.speaker.labelNm = speaker_value;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd = speaker_age_key;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelNm = speaker_age_value;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd = speaker_voc_key;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm = speaker_voc_value;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd = speaker_sex_key;
                    // param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelNm = speaker_sex_value;
                }
                
                //console.log(param.subtitleList);

                /*
                const cue = getCueFunc();
                let result = [];
                let _cue = document.querySelectorAll('textarea');
                for(let idx=0; idx<_cue.length; idx++) {
                    let subCn = _cue[idx].value;
                    let subSnm = cue[idx].subSnm;
                    let bgn_time = cue[idx].subBgnHrMs;
                    let end_time = cue[idx].subEndHrMs;
                    let speakerage_idx = _cue[idx].parentElement.parentElement.children[3].children[1].selectedIndex;
                    let speakerage_cd = _cue[idx].parentElement.parentElement.children[3].children[1].children[speakerage_idx].value;
                    let speakerage_nm = _cue[idx].parentElement.parentElement.children[3].children[1].children[speakerage_idx].textContent;
                    
                    let speakersex_idx = _cue[idx].parentElement.parentElement.children[4].children[1].selectedIndex;
                    let speakersex_cd = _cue[idx].parentElement.parentElement.children[4].children[1].children[speakersex_idx].value;
                    let speakersex_nm = _cue[idx].parentElement.parentElement.children[4].children[1].children[speakersex_idx].textContent;

                    if( cue[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd == 'LBL_KND_00_000' ) {
                        cue[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd = 'LBL_KND_24_001';
                        cue[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm = '??????';
                    }

                    result.push({
                        'subSnm': subSnm,
                        'subBgnHrMs': bgn_time,
                        'subEndHrMs': end_time,
                        'subCn': subCn,
                        'subtileSelLabelInfo': {
                            'speakerAge': {
                                'labelCd': speakerage_cd,
                                'labelNm': speakerage_nm,
                                // 'labelCd': cue[idx].subtileSelLabelInfo.speakerAge.labelCd,
                                // 'labelNm': cue[idx].subtileSelLabelInfo.speakerAge.labelNm,
                            },
                            'speakerSex': {
                                'labelCd': speakersex_cd, 
                                'labelNm': speakersex_nm,
                                // 'labelCd': cue[idx].subtileSelLabelInfo.speakerSex.labelCd, 
                                // 'labelNm': cue[idx].subtileSelLabelInfo.speakerSex.labelNm,
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
                */



                const tmpJSON = getTmpJSON();
                // tmpJSON.scenarioSelLabelInfo = getScenarioSelLabelInfo();
                tmpJSON.subtitleList = result;
                dispatch(setCue({'cue': result}));
                let episodSpeakerDependencyKey = `${tmpJSON.userInfo.prtEml}-${tmpJSON.userInfo.prtAin}-${tmpJSON.episodDTO.prgAin}`
                let episodSpeakerDependencyValue = [];
                
                for(let depend_idx=0; depend_idx<21; depend_idx++) {
                    //??????
                    let memo = speakerDependency.children[depend_idx].children[0].children[0]?.value;
                    //??????
                    let speaker = speakerDependency.children[depend_idx].children[1].children[0].children[1].children[0].value;
                    //????????? ??????
                    let ageidx = speakerDependency.children[depend_idx].children[2].children[0].children[1].selectedIndex;
                    let agecd = speakerDependency.children[depend_idx].children[2].children[0].children[1].children[ageidx].value;
                    //??????
                    let sexidx = speakerDependency.children[depend_idx].children[3].children[0].children[1].selectedIndex;
                    let sexcd = speakerDependency.children[depend_idx].children[3].children[0].children[1].children[sexidx].value;
                    episodSpeakerDependencyValue.push({ memo, speaker, ageidx, agecd, sexidx, sexcd });
                }

                setCookie('speakerdependency', JSON.stringify(episodSpeakerDependencyValue));

                setTimeout(() => {
                    let tmpSaveUrl = '/labeltool/tmpSaveLabelJob';
                    if(location.search.indexOf('jobStat=ERR') != -1 || location.search.indexOf('jobStat=ERR_ING') != -1) {
                        tmpSaveUrl = '/labeltool/tmpSaveExceptionLabelJob';
                    }
                    if( tmpJSON.subtitleList.length > 1 ) {
                        sendFetch(tmpSaveUrl, tmpJSON, {method: 'POST'})
                        ToastMsg('????????? ?????? ????????????.', 3000, null, null, 'pass');
                        // console.log(tmpJSON)
                    }
                    else {
                        const hook_param = {
                            'text': `[shift+enter] - ???????????? ?????? ??????\n\n??????: ${tmpJSON.userInfo.prtNm}\n?????????: ${tmpJSON.userInfo.prtEml}\n????????????: epNm=${tmpJSON.episodDTO.epNm}, prgAin=${tmpJSON.episodDTO.prgAin}, epAin=${tmpJSON.episodDTO.epAin}, epVdoSnm=${tmpJSON.episodDTO.epVdoSnm}\n?????????_?????????_????????????: ${tmpJSON.subtitleList.length}\n?????????_?????????_????????????: ${JSON.stringify(tmpJSON.subtitleList)}`
                        }
                        sendSwitWebHook(hook_param);
                        ToastMsg('???????????? ????????? ?????????????????????.\n????????? ?????? ??????????????? ??????????????? ???????????????.', 3000, null, null, 'warn');
                    }
                }, 500);

            }, 200);
        }
        
        const exist_video_dom = document.querySelectorAll('video').length;
        saveAction = _.debounce(saveSubtitle, 500);
        copyAction = _.debounce(copyToast, 200);
        pasteAction = _.debounce(pasteToast, 200);
        toggleAction = _.debounce(togglePlay, 200);

        document.addEventListener('click', async function (e) {
            if(e.target.nodeName == 'VIDEO') {
                last_click_dom = e.target.nodeName;
            }
        });

        if( exist_video_dom ) {
            document.addEventListener('keydown', async function (e) {
                const nextid = e.target?.nextElementSibling?.id;
                const cue = getCueFunc();
                
                if( getAgeCurrentElement() != undefined && getSexCurrentElement() != undefined && getPlaceCurrentElement() != undefined 
                    && !(nextid?.includes('comment') || nextid?.includes('speaker')) ) {
                    if( e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5' || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9' || e.key == '0' ||
                        e.key == '!' || e.key == '@' || e.key == '#' || e.key == '$' || e.key == '%' || e.key == '^' || e.key == '&' || e.key == '*' || e.key == '(' || e.key == ')'
                    ) {
                        const convertValue = {
                            '1': 1,
                            '2': 2,
                            '3': 3,
                            '4': 4,
                            '5': 5,
                            '6': 6,
                            '7': 7,
                            '8': 8,
                            '9': 9,
                            '0': 10,
                            '!': 11,
                            '@': 12,
                            '#': 13,
                            '$': 14,
                            '%': 15,
                            '^': 16,
                            '&': 17,
                            '*': 18,
                            '(': 19,
                            ')': 20,
                        };
                        const child_idx = convertValue[e.key] - 1;
                        const _cue = document.querySelectorAll('textarea');
                        const speakerDependency = document.getElementById('speaker-dependency');
                        const ageidx = speakerDependency.children[child_idx]?.children[2].children[0].children[1].selectedIndex;
                        const sexidx = speakerDependency.children[child_idx]?.children[3].children[0].children[1].selectedIndex;
                        
                        //??????
                        _cue[getSelectIndex()].parentElement.parentElement.children[6].children[1].children[0].value = speakerDependency.children[child_idx]?.children[1].children[0].children[1].children[0].value;
                        //????????? ??????
                        _cue[getSelectIndex()].parentElement.parentElement.children[3].children[1].selectedIndex = ageidx;
                        //??????
                        _cue[getSelectIndex()].parentElement.parentElement.children[4].children[1].selectedIndex = sexidx;
                        
                        cue[getSelectIndex()].subtileSelLabelInfo.speaker.labelCd = convertValueKey(speakerDependency.children[child_idx]?.children[1].children[0].children[1].children[0].value);
                        cue[getSelectIndex()].subtileSelLabelInfo.speaker.labelNm = speakerDependency.children[child_idx]?.children[1].children[0].children[1].children[0].value;
                        
                        //????????? ??????
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelCd = speakerDependency.children[child_idx]?.children[2].children[0].children[1].children[ageidx].value;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelNm = speakerDependency.children[child_idx]?.children[2].children[0].children[1].children[ageidx].textContent;
                        
                        //??????
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelCd = speakerDependency.children[child_idx]?.children[3].children[0].children[1].children[sexidx].value;
                        cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelNm = speakerDependency.children[child_idx]?.children[3].children[0].children[1].children[sexidx].textContent;

                        setTimeout(function() { 
                            dispatch(setCue({'cue': cue}));
                        }, 100)
                        // getAgeCurrentElement().selectedIndex = e.key;
                        // cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelCd = getAgeCurrentElement().options[getAgeCurrentElement().selectedIndex].value;
                        // cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelNm = getAgeCurrentElement().options[getAgeCurrentElement().selectedIndex].textContent;
                    }
                    // else if( e.key == 'q' || e.key == 'w' || e.key == 'e') {
                    //     const convertKey = {
                    //         'q': 1,
                    //         'w': 2,
                    //         'e': 3,
                    //     };
                    //     getSexCurrentElement().selectedIndex = convertKey[e.key];
                    //     cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelCd = getSexCurrentElement().options[getSexCurrentElement().selectedIndex].value;
                    //     cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelNm = getSexCurrentElement().options[getSexCurrentElement().selectedIndex].textContent;
                    // }
                    else if( e.key == 'a' || e.key == 's' || e.key == 'd' || e.key == 'f' || e.key == 'g' || e.key == 'h' || e.key == 'j' || e.key == 'k' || e.key == 'l') {
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
                            'k': getTmpJSON().subtitleLabelInfo.placeType[8].labelNm,
                            'l': getTmpJSON().subtitleLabelInfo.placeType[9].labelNm,
                        };
                        const convertValue = {
                            'a': getTmpJSON().subtitleLabelInfo.placeType[1].labelCd,
                            's': getTmpJSON().subtitleLabelInfo.placeType[2].labelCd,
                            'd': getTmpJSON().subtitleLabelInfo.placeType[3].labelCd,
                            'f': getTmpJSON().subtitleLabelInfo.placeType[4].labelCd,
                            'g': getTmpJSON().subtitleLabelInfo.placeType[5].labelCd,
                            'h': getTmpJSON().subtitleLabelInfo.placeType[6].labelCd,
                            'j': getTmpJSON().subtitleLabelInfo.placeType[7].labelCd,
                            'k': getTmpJSON().subtitleLabelInfo.placeType[8].labelCd,
                            'l': getTmpJSON().subtitleLabelInfo.placeType[9].labelCd,
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
                    else if (e.key == 'q' || e.key == 'w' || e.key == 'e' || e.key == 'r' || e.key == 't') {
                        const convertKey = {
                            'q': 0,
                            'w': 1,
                            'e': 2,
                            'r': 3,
                            't': 4,
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
                        copyAction();
                        // ToastMsg(`${getSelectIndex()+1}?????? ????????? ?????? ????????????.`, 500, null, null, 'pass');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if (e.key == 'v') {
                        cue[getSelectIndex()].subtileSelLabelInfo = last_copy_subtileSelLabelInfo;
                        const paste_target = document.querySelector('#subtitle_edit_layout').children[0].children[getSelectIndex()].children[0].children[0];
                        //????????? ??????
                        paste_target.children[3].children[1].value = cue[getSelectIndex()]?.subtileSelLabelInfo?.speakerAge?.labelCd;
                        //??????
                        paste_target.children[4].children[1].value = cue[getSelectIndex()]?.subtileSelLabelInfo?.speakerSex?.labelCd;
                        //??????
                        paste_target.children[5].children[1].children[0].value = cue[getSelectIndex()]?.subtileSelLabelInfo?.placeType?.labelNm;
                        //??????
                        paste_target.children[6].children[1].children[0].value = cue[getSelectIndex()]?.subtileSelLabelInfo?.speaker?.labelNm;
                        //?????????
                        paste_target.children[7].children[1].value = cue[getSelectIndex()]?.subtileSelLabelInfo?.speakerOvrVoc?.labelCd;
    
                        setTimeout(function() { 
                            dispatch(setCue({'cue': cue}));
                        }, 100)
    
                        pasteAction();
                        // ToastMsg(`${getSelectIndex()+1}?????? ????????? ???????????? ????????????.`, 500, null, null, 'pass');
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    createCueFunc(cue);
                }

                //MAC
                // if( navigator.platform.toUpperCase().indexOf('MAC') != -1 ) {
                if (e.ctrlKey && e.key == ',') {
                    //?????? ??????
                    let playback = parseFloat((parseFloat(getVidElement().current.playbackRate)-0.1).toFixed(1));
                    if (isNumber(playback)) {
                        getVidElement().current.playbackRate = playback;
                        ToastMsg(`${playback}???????????? ???????????????.`, 1000, null, null, 'warn');
                    }
                }
                else if(e.ctrlKey && e.key == '.') {
                    //?????? ??????
                    let playback = parseFloat((parseFloat(getVidElement().current.playbackRate)+0.1).toFixed(1));
                    if(isNumber(playback)) {
                        getVidElement().current.playbackRate = playback;
                        ToastMsg(`${playback}???????????? ???????????????.`, 1000, null, null, 'pass');
                    }
                }
                else if(e.shiftKey && e.key == 'Enter') {
                    // if(e.target.nodeName == 'TEXTAREA') {
                    //     idxFromSaveFocus = e.target.id;
                    // }
                    // setIsCurrentUpdate(false);
                    saveAction();
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if(e.key == ']' || e.key == '\\' || e.key == '|') {
                    let isPlaying = getVidElement().current.currentTime > 0 && !getVidElement().current.paused && !getVidElement().current.ended && getVidElement().current.readyState > getVidElement().current.HAVE_CURRENT_DATA;
                    createPlaySectionEndTime(9999999);
                    toggleAction(isPlaying);
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if(e.key == 'ArrowRight' && last_click_dom == 'VIDEO') {
                    createVideoCurrentTime(getVidElement().current.currentTime + 0.5);
                    e.preventDefault();
                    e.stopPropagation();
                }
                else if(e.key == 'ArrowLeft' && last_click_dom == 'VIDEO') {
                    createVideoCurrentTime(getVidElement().current.currentTime - 0.5);
                    e.preventDefault();
                    e.stopPropagation();
                }
                // else if(e.key == '!' || e.key == '@' || e.key == '#' || e.key == '$' || e.key == '%' || e.key == '^' || e.key == '&' || e.key == '*') {
                //     const convertValue = {
                //         '!': 1,
                //         '@': 2,
                //         '#': 3,
                //         '$': 4,
                //         '%': 5,
                //         '^': 6,
                //         '&': 7,
                //         '*': 8,
                //     };
                    
                //     if( getFuncMacro()[convertValue[e.key]] ) {
                //         cue[getSelectIndex()].subtileSelLabelInfo = getFuncMacro()[convertValue[e.key]];
                //         const paste_target = document.querySelector('#subtitle_edit_layout').children[0].children[getSelectIndex()].children[0].children[0];
                //         //????????? ??????
                //         paste_target.children[3].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerAge.labelCd;
                //         //??????
                //         paste_target.children[4].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerSex.labelCd;
                //         //??????
                //         paste_target.children[5].children[1].children[0].value = cue[getSelectIndex()].subtileSelLabelInfo.placeType.labelNm;
                //         //??????
                //         paste_target.children[6].children[1].children[0].value = cue[getSelectIndex()].subtileSelLabelInfo.speaker.labelNm;
                //         //?????????
                //         paste_target.children[7].children[1].value = cue[getSelectIndex()].subtileSelLabelInfo.speakerOvrVoc.labelCd;
    
                //         setTimeout(function() { 
                //             dispatch(setCue({'cue': cue}));
                //         }, 100);

                //         pasteAction();
                //         e.preventDefault();
                //         e.stopPropagation();
                //         createCueFunc(cue);
                //     }
                // }
            });
        }

    }, [dispatch, macro])
    return(
        <>
        </>
    )
}