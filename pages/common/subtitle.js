import styles from '../../styles/Layout.module.css'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCue } from '../../store/nia_layout/StoreCueSlice';
import { humanReadableTime, subtitleSectionElementClick, setSubtitleChildren, subtitleContext, subtitleContextClick } from './common_script';
import _ from "lodash";
import SubtitleTextInfo from './subtitle_text_info';
import { getCommentListRefElement, getCommentRefElement, getStartTImeRefElement, getVidElement } from './video_layout';
import { getReplacePopupElement } from './edit';
import SelectItem from './select_item';
import SearchBoxAutoComplete from './searchbox_autocomplete';
import { getVideoDuration } from '../../store/nia_layout/StoreVideoSlice';

let _cue = [];
let refArticleElement;

/**
 * 
 * @param {*} data 
 * @description articleElement set함수
 */
function _setArticleElement(data) {
  refArticleElement = data;
}
/**
 * 
 * @param {*} data 
 * @description articleElement get함수
 */
export function getArticleElementFromEdit() {
  return refArticleElement;
}
export function createCueFunc(data) {
  _cue = [...data];
}
export function getCueFunc() {
  return _cue;
}

export const lineCommentClick = async (e) => {
  let _startTime = `시작시간 ${humanReadableTime(getVidElement().current.currentTime)}`
  const _commentListRefElement = getCommentListRefElement();
  const _commentRefElement = getCommentRefElement();
  const _startTimeRefElement = getStartTImeRefElement();
  _startTimeRefElement.current.textContent = _startTime;
  _startTimeRefElement.current.id = getVidElement().current.currentTime;
  _commentRefElement.current.textContent = '';
  createDisplayNoneElement(_commentListRefElement.current.previousSibling);
  createDisplayEmptyElement(_commentListRefElement.current);
};

export const lineReplaceClick = (e) => {
  createDisplayEmptyElement(getReplacePopupElement().current);
};

export default function Subtitle({ info }) {
  const contextmenuRef = useRef(null);
  const age_list = {
    'title': '발화자 연령', 
    'itemlist': info.subtitleLabelInfo.speakerAge
  };
  const sex_list = {
    'title': '성별', 
    'itemlist': info.subtitleLabelInfo.speakerSex
  };
  const place_list = {
    'title': '장소',
    'itemlist': info.subtitleLabelInfo.placeType
  }
  const ovrvoc_list = {
    'title': '중첩음',
    'itemlist': info.subtitleLabelInfo.speakerOvrVoc
  }
  const speaker_list = {
    'title': '화자',
    'itemlist': info.subtitleLabelInfo.speaker
  }

  let data = useSelector(getCue);
  const articleElement = useRef(null);
  const sectionElement = useRef(null);

  let duration = useSelector(getVideoDuration);

  if( isNaN(parseInt(duration)) ) {
      duration = 0;
  }
  
  data.map((arr, idx) => {
    if( (arr.subBgnHrMs/1000) < parseInt(duration) ) {
      //현재 그려야 할 자막의 시작시간이 영상시간보다 짧은 경우(정상)
    }
    else{
      //현재 그려야 할 자막의 시작시간이 영상시간보다 긴 경우(비정상)
      delete data[idx]
    }
  })
  
  data = data.filter(() => true);

  useEffect(() => {
    if (articleElement.current != null) {
      setSubtitleChildren(articleElement.current.children);
      _setArticleElement(articleElement);
    }
    createCueFunc(data);
  }, [data]);

  return (
    <>
      <style jsx>{`
          select {
            -webkit-appearance:none; /* 크롬 화살표 없애기 */
            -moz-appearance:none; /* 파이어폭스 화살표 없애기 */
            appearance:none /* 화살표 없애기 */
            text-align-last: center;
          }
        `}
      </style>
      <article ref={articleElement} className={styles.subtitle_edit_section}>
        {
          data.map((arr, idx) => {
            return (
              <section key={`${arr.subSnm}_${arr.subBgnHrMs}_${arr.subCn}`} 
                        id={`${idx}_${(parseFloat(arr.subBgnHrMs)/1000).toFixed(3)}_${(parseFloat(arr.subEndHrMs)/1000).toFixed(3)}`} 
                        ref={sectionElement}
                        className={styles.subtitle_edit_line}
                        style={{'minWidth': '480px'}}
                        // onClick={subtitleSectionElementClick}
                        onClick={(e) => {
                          contextmenuRef.current.style.display = 'none';
                          subtitleSectionElementClick(e);
                        }}
                        onMouseLeave={(e) => {
                          e.className = 'hidden';
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          subtitleContext(contextmenuRef, e);
                        }}
              >
                <div className={styles.subtitle_edit_content}>
                  <div className={styles.subtitle_edit_content_row} datacrush-color={"nocolor"}>

                    <div className={styles.subtitle_edit_content_checkbox}>
                      <div className={styles.subtitle_edit_content_checkbox_click}>
                        <div> {idx + 1} </div>
                      </div>
                    </div>
                    <div className={styles.time_font_layout}>
                      <div className={styles.time_font}>시작시간 {humanReadableTime(arr.subBgnHrMs)}</div>
                      <div className={styles.time_font}>종료시간 {humanReadableTime(arr.subEndHrMs)}</div>
                    </div>
                    <SubtitleTextInfo id={idx} arr={arr}></SubtitleTextInfo>
                    <SelectItem key={`age_${idx}`} response={age_list} setitem={arr.subtileSelLabelInfo.speakerAge} defaultvalue={arr.subtileSelLabelInfo.speakerAge} types={'subtitle'}></SelectItem>
                    <SelectItem key={`sex_${idx}`} response={sex_list} setitem={arr.subtileSelLabelInfo.speakerSex} defaultvalue={arr.subtileSelLabelInfo.speakerSex} types={'subtitle'}></SelectItem>
                    <SearchBoxAutoComplete key={`place_${idx}`} placeholder={'장소를 입력하세요'} dataListName={'comment-options'} dataList={place_list} index={idx} setItem={arr.subtileSelLabelInfo.placeType} title={'장소'} maxWidth={'250px'}></SearchBoxAutoComplete>
                    <SearchBoxAutoComplete key={`speaker_${idx}`} placeholder={'화자를 입력하세요'} dataListName={'speaker-options'} dataList={speaker_list} index={idx} setItem={arr.subtileSelLabelInfo.speaker} title={'화자'} maxWidth={'250px'}></SearchBoxAutoComplete>
                    <SelectItem key={`ovrvoc_${idx}`} response={ovrvoc_list} setitem={arr.subtileSelLabelInfo.speakerOvrVoc} types={'subtitle'}></SelectItem>
                  </div>
                </div>
              </section>
            )
          })
        }
        <div ref={contextmenuRef} id={"subtitle-contextmenu"}> 
          <div className={"bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500 shadow-lg"}>
            <div id={'macro_1'} 
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_1'}>1번 매크로 저장</div>
            </div>
            <div id={'macro_2'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_2'}>2번 매크로 저장</div>
            </div>
            <div id={'macro_3'} 
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_3'}>3번 매크로 저장</div>
            </div>
            <div id={'macro_4'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_4'}>4번 매크로 저장</div>
            </div>
            <div id={'macro_5'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_5'}>5번 매크로 저장</div>
            </div>
            <div id={'macro_6'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_6'}>6번 매크로 저장</div>
            </div>
            <div id={'macro_7'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_7'}>7번 매크로 저장</div>
            </div>
            <div id={'macro_8'}
                onClick={(e) => { subtitleContextClick(contextmenuRef, e); }} 
                className={"flex hover:bg-gray-100 py-1 px-2 rounded"}>
              <div id={'macro_8'}>8번 매크로 저장</div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export async function getServerSideProps(context) {
  const data = context.query
  return { props: { data } }
}