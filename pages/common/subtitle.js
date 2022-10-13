import styles from '../../styles/Layout.module.css'
import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setCue, getCue } from '../../store/nia_layout/StoreCueSlice';
import { humanReadableTime, subtitleSectionElementClick, ToastMsg, updateRegionFromCustomEvent, setSubtitleChildren } from './common_script';
import _, { debounce } from "lodash";
import SubtitleTextInfo from './subtitle_text_info';
import { getCommentListRefElement, getCommentRefElement, getStartTImeRefElement, getVidElement } from './video_layout';
import { getReplacePopupElement } from './edit';
import { getPlatform } from '../../config/serverconfig';
import SelectItem from './select_item';
import SearchBoxAutoComplete from './searchbox_autocomplete';

let _cue = [];
let refArticleElement;
let saveLineAddAction;
let saveLineRemoveAction;
let _sectionElement;

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

function setSectionElement(data) {
  _sectionElement = data;
}
function getSectionElement() {
  return _sectionElement;
}

export default function Subtitle({ info }) {
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

  const data = useSelector(getCue);
  const articleElement = useRef(null);
  const sectionElement = useRef(null);
  const dispatch = useDispatch();
  
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
                        onClick={subtitleSectionElementClick} 
                        // onBlur={(e) => createHideCheckSubtitleWrap(e)}
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
                    <SelectItem key={`age_${idx}`} response={age_list} setitem={arr.subtileSelLabelInfo.speakerAge} types={'subtitle'}></SelectItem>
                    <SelectItem key={`sex_${idx}`} response={sex_list} setitem={arr.subtileSelLabelInfo.speakerSex} types={'subtitle'}></SelectItem>
                    <SearchBoxAutoComplete key={`place_${idx}`} placeholder={'장소를 입력하세요'} dataListName={'comment-options'} dataList={place_list} index={idx} setItem={arr.subtileSelLabelInfo.placeType} title={'장소'}></SearchBoxAutoComplete>
                    <SelectItem key={`ovrvoc_${idx}`} response={ovrvoc_list} setitem={arr.subtileSelLabelInfo.speakerOvrVoc} types={'subtitle'}></SelectItem>
                  </div>
                </div>
              </section>
            )
          })
        }
      </article>
    </>
  )
}

export async function getServerSideProps(context) {
  const data = context.query
  return { props: { data } }
}