import styles from '../../styles/Layout.module.css'
import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setCue, getCue } from '../../store/nia_layout/StoreCueSlice';
import { humanReadableTime, subtitleSectionElementClick, ToastMsg, updateRegionFromCustomEvent, setSubtitleChildren } from './common_script';
import _, { debounce } from "lodash";
// import SubtitleTextInfo from './subtitle_text_info';
import { getCommentListRefElement, getCommentRefElement, getStartTImeRefElement, getVidElement } from './video_layout';
import { getReplacePopupElement } from './edit';
import { getPlatform } from '../../config/serverconfig';
import SelectItem from './select_item';

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


  const data = useSelector(getCue);
  const articleElement = useRef(null);
  const sectionElement = useRef(null);
  const rowAddElement = useRef(null);
  const dispatch = useDispatch();
  
  // console.log('info@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  // console.log(info)
  // console.log('data##################################')
  // console.log(data)

  // console.log(initialize)
 
  /*
  const lineRemoveClickDebounce = useCallback(() => {
    let data = getCueFunc();
    let section_info = getSectionElement().id.split('_');
    let insert_idx = section_info[0];
    if (confirm(`${JSON.stringify(data[insert_idx].subCn)}문장을 삭제하시겠습니까?`)) {
      data.splice(insert_idx, 1);
      data = _.sortBy(data, ['subBgnHrMs', 'subEndHrMs']);
      let cue = updateRegionFromCustomEvent(data);
      setSubtitleFromCustomEvent(info.data.layout);
      dispatch(setCue({ cue }));
      ToastMsg('문장을 삭제했습니다.', 3000, null, null, 'pass');
    }
  }, [dispatch, info.data.layout]);

  const lineAddClickDebounce = useCallback(() => {
    let data = getCueFunc();
    let section_info = getSectionElement().id.split('_');
    let insert_idx = parseInt(section_info[0]);
    let newline_time = 0.5
    let bef_endtime = parseFloat(data[insert_idx].subEndHrMs);
    let aft_endtime = parseFloat(data[insert_idx+1].subBgnHrMs);
    
    console.log(aft_endtime - bef_endtime)
    // /*
    if( (aft_endtime - bef_endtime) < newline_time*2 ) {
      ToastMsg(`빈라인 추가를 하기 위해서는 앞, 뒤의 간격이 ${newline_time*2}초보다 커야 합니다.`, 3000, null, null, 'warn');            
    }
    else {
      let subBgnHrMs = parseFloat((parseFloat(section_info[2]) + newline_time).toFixed(3));
      let subEndHrMs = subBgnHrMs + newline_time;
      data.splice(insert_idx, 0, { "subSnm": insert_idx, "subCn": "", "subBgnHrMs": subBgnHrMs, "subEndHrMs": subEndHrMs });
      data = _.sortBy(data, ['subBgnHrMs', 'subEndHrMs']);
      let cue = updateRegionFromCustomEvent(data);
      setSubtitleFromCustomEvent(info.data.layout);
      dispatch(setCue({ cue }));
      // ToastMsg('변경사항을 저장했습니다.', 3000, null, null, 'pass');
      setIsCurrentUpdate(false);
    }
  }, [dispatch, info.data.layout]);


  const lineAddClick = useCallback((e) => {
    setSectionElement(e.target.parentElement.parentElement);
    if (saveLineAddAction == null || saveLineAddAction == undefined) {
      saveLineAddAction = debounce(lineAddClickDebounce, 300);
    }

    if (getIsCurrentUpdate() == false) {
      saveLineAddAction();
    }
    else {
      ToastMsg('변경사항을 저장해야 합니다.', 3000, null, null, 'warn');
    }
  }, [lineAddClickDebounce]);

  const lineRemoveClick = useCallback((e) => {
    setSectionElement(e.target.parentElement.parentElement);
    if (saveLineRemoveAction == null || saveLineRemoveAction == undefined) {
      saveLineRemoveAction = debounce(lineRemoveClickDebounce, 50);
    }

    if (getIsCurrentUpdate() == false) {
      saveLineRemoveAction();
    }
    else {
      ToastMsg('변경사항을 저장해야 합니다.', 3000, null, null, 'warn');
    }
  }, [lineRemoveClickDebounce]);

  */

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
                    {/* <SubtitleTextInfo id={idx} arr={arr}></SubtitleTextInfo> */}
                    <SelectItem key={`age_${idx}`} response={age_list} setitem={arr.subtileSelLabelInfo.speakerAge} types={'subtitle'}></SelectItem>
                    <SelectItem key={`sex_${idx}`} response={sex_list} setitem={arr.subtileSelLabelInfo.speakerSex} types={'subtitle'}></SelectItem>
                    <SelectItem key={`place_${idx}`} response={place_list} setitem={arr.subtileSelLabelInfo.placeType} types={'subtitle'}></SelectItem>
                  </div>
                </div>
              </section>
            )
          })
        }
      </article>
      {/* <article className={styles.subtitle_label_section}>
        {
          data.map((arr, idx) => {
            return(
              <section key={`label_${idx}`} className={styles.subtitle_edit_line}>
                <div className={styles.subtitle_edit_content}>
                  <div className={styles.subtitle_label_content_row} style={{'display':'flex', 'flexDirection': 'column', 'padding': '10px'}}>
                  <SelectItem key={`age_${arr.subBgnHrMs}_${idx}`} response={age_list} setitem={'subtitle'}></SelectItem>
                  <SelectItem key={`sex_${arr.subEndHrMs}_${idx}`} response={sex_list} setitem={'subtitle'}></SelectItem>
                  </div>
                </div>
              </section>
            )
          })
        }  
      </article> */}
    </>
  )
}

export async function getServerSideProps(context) {
  const data = context.query
  return { props: { data } }
}