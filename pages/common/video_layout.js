import styles from '../../styles/Layout.module.css'
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getPlaySectionEndTime, readableTimeToMilTime, sendFetch } from '../common/common_script';
import { useRouter } from 'next/router';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import { getHost } from '../../config/serverconfig';
import { createCueFunc, getCueFunc } from './subtitle';
import { getCookie } from 'cookies-next';
import { setVideoDuration } from '../../store/nia_layout/StoreVideoSlice';
import _ from 'lodash';

let _video_current_time = 0;
let _tracks;
let _vidElement;
let _commentListRefElement;
let _commentRefElement;
let _startTimeRefElement;
let _viewSubtitleRefElement;
let _viewSubtitleContainerRefElement;
let _beforeViewSubtitle = '';
let _commentContainer;
let _uniqeId;
let _ageElement;
let _sexElement;
let _placeElement;
let _ovrVocElement
let _videoDuration;
//let _tmpJSON = {};
let _select_index = 0;
let _cue;
let _scenarioSelLabelInfo = {
  'category': {
      'labelCd': '',
      'labelNm': '',
  },
  'conversationSpeakers': {
      'labelCd': '',
      'labelNm': '',
  },
  'keyword': {
      'labelCd': '',
      'labelNm': '',
  },
  'opinion': {
      'labelCd': '',
      'labelNm': '',
  },
  'subCategory': {
      'labelCd': '',
      'labelNm': '',
  },
};
/**
 * 
 * @param {} data 
 * @description 자막 변경내용 동기화 함수 
 */
function setTracks(data) {
  _tracks = data;
}

/**
 * 
 * @returns 
 * @description 자막 내용 얻는 함수
 */
export function getTracks() {
  return _tracks;
}

function createSelectIndex(data) {
  _select_index = data;
}

export function getSelectIndex() {
  return _select_index;
}

function setVideoCurrentTime(data) {
  _video_current_time = data * 1000;
}
export function getVideoCurrentTime() {
  return _video_current_time;
}

function createVidElement(data) {
  _vidElement = data;
}
export function getVidElement() {
  return _vidElement;
}
export function createTmpJSON(data) {
  _scenarioSelLabelInfo = data;
}
export function getTmpJSON() {
  return _scenarioSelLabelInfo;
}

function createAgeCurrentElement(data) {
  _ageElement = data;
}
export function getAgeCurrentElement(data) {
  return _ageElement;
}
function createSexCurrentElement(data) {
  _sexElement = data;
}
export function getSexCurrentElement(data) {
  return _sexElement;
}
function createPlaceCurrentElement(data) {
  _placeElement = data;
}
export function getPlaceCurrentElement(data) {
  return _placeElement;
}
function createOvrVocCurrentElement(data) {
  _ovrVocElement = data;
}
export function getOvrVocCurrentElement(data) {
  return _ovrVocElement;
}

function createUniqeId(data) {
  _uniqeId = data;
}
export function getUniqeId() {
  return _uniqeId;
}

function createCommentListRefElement(data) {
  _commentListRefElement = data;
}
export function getCommentListRefElement() {
  return _commentListRefElement;
}

function createCommentRefElement(data) {
  _commentRefElement = data;
}
export function getCommentRefElement() {
  return _commentRefElement;
}

function createViewSubtitleContainerRefElement(data) {
  _viewSubtitleContainerRefElement = data;
}
export function getViewSubtitleContainerRefElement() {
  return _viewSubtitleContainerRefElement;
}

function createViewSubtitleRefElement(data) {
  _viewSubtitleRefElement = data;
}
export function getViewSubtitleRefElement() {
  return _viewSubtitleRefElement;
}

function createStartTimeRefElement(data) {
  _startTimeRefElement = data;
}
export function getStartTImeRefElement() {
  return _startTimeRefElement;
}

function createCommentContainerRefElement(data) {
  _commentContainer = data;
}
export function getCommentContainerRefElement() {
  return _commentContainer;
}

export function videoFullScreen() {
  getVidElement().current.style.height = '100%';
  getVidElement().current.style.objectFit = 'fill'
  getCommentContainerRefElement().current.style.display = 'none';
}

export function videoSplitScreen() {
  getVidElement().current.style.height = '';
  getVidElement().current.style.objectFit = ''
  getCommentContainerRefElement().current.style.display = '';

}

// export const CreateViewSubtitle = (text, isView) => {
export const CreateViewSubtitle = (info) => {
  let subCn = info.subCn;
  let _isView = info.isView
  let _containerTop = 3;
  let _topLevel = 2;
  let _subtitleCount = 0;
  if (subCn != undefined) {
    let _splitText = subCn.split('\n');
    let _result = '';
    // let _result = text.replaceAll('\n', `<p>${text}</p>`);
    for (let idx = 0; idx < _splitText.length; idx++) {
      _result += `<p class=${styles.view_subtitle_font}>${_splitText[idx]}</p>`
      _subtitleCount++;
    }
    if (_beforeViewSubtitle != subCn && _isView) {
      getViewSubtitleContainerRefElement().current.style.top = `${parseInt(_containerTop + (_topLevel * _subtitleCount)) * -1}rem`;
      getViewSubtitleRefElement().innerHTML = _result;
    }
    else if (!_isView) {
      getViewSubtitleRefElement().innerHTML = _result;
    }
  }
  else {
    return (<></>)
  }
  _beforeViewSubtitle = subCn;
}



export default function VideoLayout({ video_info }) {
  _cue = _.cloneDeep(video_info?.subtitleList);
  createTmpJSON(video_info);
  let trackElement = useRef(null);
  let vidElement = useRef(null);
  const commentContainerRefElement = useRef(null);
  const viewSubtitleContainerRefElement = useRef(null);
  const viewSubtitleRefElement = useRef(null);
  const commentListRefElement = useRef(null);
  const startTimeRefElement = useRef(null);
  const commentRefElement = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // createCommentListRefElement(commentListRefElement);
  // createCommentRefElement(commentRefElement);
  createStartTimeRefElement(startTimeRefElement);
  createViewSubtitleContainerRefElement(viewSubtitleContainerRefElement);
  // createCommentContainerRefElement(commentContainerRefElement);
  createVidElement(vidElement);
  
  const action_setCue = useCallback((data) => {
    let cue = [];
    for (let idx = 0; idx < data.length; idx++) {
      cue.push({
        'subSnm': data[idx].subSnm,
        'subCn': data[idx].subCn,
        'subBgnHrMs': data[idx].subBgnHrMs,
        'subEndHrMs': data[idx].subEndHrMs,
        'subtileSelLabelInfo': {
          'speakerAge': {
              'labelCd': data[idx].subtileSelLabelInfo?.speakerAge?.labelCd,
              'labelNm': data[idx].subtileSelLabelInfo?.speakerAge?.labelNm,
          },
          'speakerSex': {
              'labelCd': data[idx].subtileSelLabelInfo?.speakerSex?.labelCd,
              'labelNm': data[idx].subtileSelLabelInfo?.speakerSex?.labelNm,
          },
          'placeType': {
            'labelCd': data[idx].subtileSelLabelInfo?.placeType?.labelCd,
            'labelNm': data[idx].subtileSelLabelInfo?.placeType?.labelNm,
          },
          'speakerOvrVoc': {
            'labelCd': data[idx].subtileSelLabelInfo?.speakerOvrVoc?.labelCd,
            'labelNm': data[idx].subtileSelLabelInfo?.speakerOvrVoc?.labelNm,
          },
          'speaker': {
            'labelCd': data[idx].subtileSelLabelInfo?.speaker?.labelCd,
            'labelNm': data[idx].subtileSelLabelInfo?.speaker?.labelNm,
          }
        }
      });
    }

    dispatch(setCue({ cue }));

    // setTimeout(() => {
      const tmpSaveLabelJSON = {
        'userInfo': video_info.userInfo,
        'episodDTO': video_info.episodDTO,
        'scenarioSelLabelInfo': video_info.scenarioSelLabelInfo,
        'scenarioLabelInfo': video_info.scenarioLabelInfo,
        'subtitleLabelInfo': video_info.subtitleLabelInfo,
        'subtitleList': cue,
      };
  
      const tmpSaveLabelUrl = '/labeltool/tmpSaveLabelJob';
      const tmpSave = async () => {
        return await sendFetch(tmpSaveLabelUrl, tmpSaveLabelJSON, {method:"POST"});
      }

      if( tmpSaveLabelJSON?.subtitleList?.length > 1 ) {
        tmpSave();
      }
    // }, 500);
    
  }, [dispatch, video_info]);

  
  useEffect(() => {
    // console.log(video_info)
    createUniqeId(`${video_info.episodDTO.prgAin}_${video_info.episodDTO.epAin}_${video_info.episodDTO.epVdoSnm}`);
    if (vidElement.current.src) {
      vidElement.current.src = '';
    }
    let config = {
      // debug: true,
      xhrSetup: function (xhr,url) {
        xhr.withCredentials = true; // do send cookie
        xhr.setRequestHeader("Access-Control-Allow-Headers","*");
        xhr.setRequestHeader("Access-Control-Allow-Origin","https://wooki.vivo.best");
        // xhr.setRequestHeader("Access-Control-Allow-Origin","https://wooki.vivo.best, https://prodlabelfront.datacrs.ai");
        xhr.setRequestHeader("X-Custom-PSK", "predatacrush");
        xhr.setRequestHeader("Access-Control-Allow-Credentials","true");
      }
    };

    let hls = new Hls(config);
    // createDisplayNoneElement(commentListRefElement.current);
    createViewSubtitleRefElement(viewSubtitleRefElement.current);
    // let video_url = video_info.video_url
    // let subtitle_url = video_info.subtitle_url;
   
    async function initialInfo(video_info) {
      /*
      const cueJSON = await fetch('https://datacrush.asuscomm.com:30000/labeltool/getLabelJobForScenario', {
      // const cueJSON = await fetch('https://vivo.best/NIA/NIA_childrenEdu0001_1_rev.vtt', {
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          // 'X-Custom-PSK': 'predatacrush',
          // 'Access-Control-Allow-Origin':'https://wooki.vivo.best',
          // 'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(param),
        // body: param,
        method: 'POST',
        // mode: 'no-cors' //no-cors, cors
      })
      .then( response => {
        return response.json();
        // return response.text();
      });
      */
      let video_url = await fetch(video_info.episodDTO.filePath, {
      // let video_url = await fetch('https://vivo.best/video/company/ebs/P-004-0021/P-004-0021-0001/P-004-0021-0001-00005/v2/split/P-004-0021-0001-00005_1/hls/P-004-0021-0001-00005_1.m3u8', {
        // let video_url = await fetch('https://vivo.best/NIA/NIA_childrenEdu0001_1_0.m3u8', {
        // credentials: 'same-origin',
        credentials: 'include',
        // credentials: 'omit',
        // withCredentials: true,
        headers: { 
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin':'https://wooki.vivo.best, https://prodlabelfront.datacrs.ai',
          'Access-Control-Allow-Credentials': true,
          // 'X-Custom-PSK': 'predatacrush'
        },
        method: 'GET',
        // mode: 'no-cors' //no-cors, cors
      })
      .then( response => {
        return response.url;
      });
      
      _tracks = vidElement.current.textTracks[0].cues;
      hls.loadSource(video_url);
      hls.attachMedia(vidElement.current);

      // trackElement.current.setAttribute('src', subtitle_url);

      // */
      /*
      const cueJSON = await fetch(`${'http://localhost:30501'}/worklist/subtitle/`, {
      // const cueJSON = await fetch(`${host}/worklist/subtitle/`, {
      // const cueJSON = await fetch(`${host}/samgwang/PS-2021024074-01-000_fixed.vtt`, {
        credentials: 'same-origin',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin':'*',
        },
        method: 'POST',
        body: JSON.stringify(param),
        mode: 'cors' //no-cors, cors
      })
      .then( response => response.json());
      */

      if (_tracks == null) {
        router.reload();
      }
  
      if (_tracks != null) {
        //우선 localStorage부터 탐색
        if( localStorage.getItem(`${video_info.prgAin}_${video_info.epAin}_${video_info.epVdoSnm}`) ) {
          let cue = JSON.parse(localStorage.getItem(`${video_info.prgAin}_${video_info.epAin}_${video_info.epVdoSnm}`));
          createCueFunc(cue);
          action_setCue(cue);
        }
        else {
          console.log(_cue);
          createCueFunc(_cue);
          action_setCue(_cue);
          // createCueFunc(video_info.subtitleList);
          // action_setCue(video_info.subtitleList);

          /*
          if( typeof(video_info.subtitleList) !== 'string' && video_info.subtitleList?.length > 0 ) {
            // console.log(video_info.subtitleList)
            debugger
            createCueFunc(video_info.subtitleList);
            action_setCue(video_info.subtitleList);
          }
          else if( _tracks?.length == 0 || typeof(video_info.subtitleList) === 'string' ) {
            let JSON = [];
            // console.log(humanReadableTime(12000))
            video_info.subtitleList.split('\n\n').map((arr,idx) => {
              if(arr.indexOf('WEBVTT') == -1 && arr !== '') {
                  let split_vtt = arr.split('\n');
                  let bgn_time = split_vtt[0].split('-->')[0].replaceAll(' ', '');
                  let end_time = split_vtt[0].split('-->')[1].replaceAll(' ', '');
                  let subCn = split_vtt[1];
                  JSON.push({
                    "subCn": subCn,
                    "subSnm": idx,
                    "subBgnHrMs": readableTimeToMilTime(bgn_time),
                    "subEndHrMs": readableTimeToMilTime(end_time),
                  })
              }
            });
            createCueFunc(JSON);
            action_setCue(JSON);
          }
          else {
            let JSON = [];
            for(let idx=0; idx<_tracks.length; idx++) {
              JSON.push({
                "subCn": _tracks[idx].text,
                "subSnm": _tracks[idx].id,
                "subBgnHrMs": _tracks[idx].startTime,
                "subEndHrMs": _tracks[idx].endTime,
              })
            }
            // console.log(JSON)
            createCueFunc(JSON);
            action_setCue(JSON);
          }
          */
        }
  
        vidElement.current.textTracks[0].mode = 'hidden';

        vidElement.current.addEventListener('timeupdate', function (e) {
          let _isViewSubtitle = false;
          let _viewSubtitle = '';
          let _currentTime = e.target.currentTime;
          let isPlaying = _currentTime > 0 && !e.target.paused && !e.target.ended && e.target.readyState > e.target.HAVE_CURRENT_DATA;
          let _data = getCueFunc();
          for(let idx=0; idx<_data.length; idx++) {
            let start = (parseFloat(_data[idx]?.subBgnHrMs)/1000).toFixed(3);
            let end = (parseFloat(_data[idx]?.subEndHrMs)/1000).toFixed(3);
            let target_id = `${idx}_${start}_${end}`;
            let target = document.getElementById(target_id)
            if (start <= _currentTime && end >= _currentTime) {
              createSelectIndex(idx);
              target.children[0].children[0].style.backgroundColor = "var(--theme-whiteblue-color)";
              subtitle_edit_layout.scrollTop = target.offsetTop - (subtitle_edit_layout.clientHeight / 0.8);
              createAgeCurrentElement(target.children[0].children[0].children[3].children[1]);
              createSexCurrentElement(target.children[0].children[0].children[4].children[1]);
              createPlaceCurrentElement(target.children[0].children[0].children[5].children[1]);
              createOvrVocCurrentElement(target.children[0].children[0].children[7].children[1]);
            }
            else {
              target.children[0].children[0].style.backgroundColor = "";
            }
          }

          setVideoCurrentTime(_currentTime);
  
          if ((_currentTime >= getPlaySectionEndTime())) {
            if (isPlaying) {
              e.target.pause();
            }
          }
  
          for (let idx = 0; idx < _data.length; idx++) {
            let start = (parseFloat(_data[idx].subBgnHrMs)/1000).toFixed(3);
            let end = (parseFloat(_data[idx].subEndHrMs)/1000).toFixed(3);
            if ((_currentTime >= start) && (_currentTime < end)) {
              // viewSubtitleRefElement.current.textContent = _data[idx].text;
              _isViewSubtitle = true;
              _viewSubtitle = _data[idx].subCn;
              break;
            }
            // else {
            //   // viewSubtitleRefElement.current.textContent = '';
            //   // ViewSubtitle(null, null, null);
            //   console.log(_currentTime, _data[idx].startTime, _data[idx].endTime)
            //   createViewSubtitle(null);
            // }
          }
  
          CreateViewSubtitle({ 'subCn': _viewSubtitle, 'isView': _isViewSubtitle });
  
        });
        
        vidElement.current.addEventListener('loadedmetadata', function (e) {
          dispatch(setVideoDuration({'video_duration': e.target.duration}));
          let vivo_last_info = localStorage.getItem('vivo_last_info');
          if (vivo_last_info != null) {
            if (JSON.parse(vivo_last_info)['video_url'] == video_info.video_url) {
              // action_setCue(JSON.parse(JSON.parse(vivo_last_info)['json']));
            }
            else {
              // action_setCue(_tracks);
            }
          }
        });
      }

    }
    
    initialInfo(video_info);

  }, [video_info, router, action_setCue, dispatch]);

  return (
    <>
      <video id={"video"} className={styles.vid} ref={vidElement} preload={"auto"} crossOrigin={"anonymous"} controlsList={"nodownload"} type={"video/mp4"} poster={"/datacrush-logo.png"} controls>
        <source id={"source_id"} type={"video/mp4"} />
        <track id={"track_id"} ref={trackElement} label={"Korean"} kind={"subtitles"} srcLang={"ko"} default />
        {/* <track id={"track_id"} ref={trackElement} label={"Korean"} kind={"subtitles"} srcLang={"ko"} mode={'hidden'} default /> */}
        {/* <track id={"track_id"} ref={trackElement} label={"Korean"} kind={"subtitles"} srcLang={"ko"} default /> */}
      </video>
      <section ref={viewSubtitleContainerRefElement} className={styles.view_subtitle_container}>
        <div className={styles.view_subtitle_wrap}>
          <span className={styles.view_subtitle_font} ref={viewSubtitleRefElement}></span>
        </div>
      </section>
    </>
  )
}

// export async function getStaticProps() {
//   let trackElement = useRef(null);
//   let vidElement = useRef(null);
//   let tracks;

//   let hls = new Hls();
//   let video_url = '/PS-2014218426-01-000.m3u8';
//   let subtitle_url = '/PS-2014218426-01-000_fixed.vtt';
//   tracks = vidElement.current.textTracks[0].cues;
//   hls.loadSource(video_url);
//   hls.attachMedia(vidElement.current);
//   trackElement.current.setAttribute('src', subtitle_url);

//   console.log(tracks)
//   return {
//     props: {
//       tracks,
//     }
//   }
// }