import styles from '../../styles/Layout.module.css';
import VideoLayout from './video_layout';
// import Subtitle, { getCueFunc } from './subtitle';
// import CustomEvent, { createDisplayNoneElement, getRegionBlock } from '../../custom_event';
import React, { useCallback, useEffect } from "react";
// import Footer from "../../layouts/footer_wave";
import { useRef } from 'react';
import Image from 'next/image';
import Subtitle from './subtitle';
import SelectItem from './select_item';
import { sendFetch } from './common_script';
import { useRouter } from 'next/router';
import { NextResponse } from 'next/server';
import { getCookie, setCookie } from 'cookies-next';
// import CustomSetPopup from '../common/custom_set_popup';
// import SubtitleReplacePopup from '../common/subtitle_replace_popup';
// import CheckSubtitle from '../common/check_subtitle';

let _layerPopupElement;
let _replacePopupElement;
let _getSubtitleInfo;

const createSubtitleInfo = (data) => {
  _getSubtitleInfo = data;
}
export const getSubtitleInfo = () => {
  return _getSubtitleInfo;
}

const createReplacePopupElement = (data) => {
  _replacePopupElement = data;
}
export const getReplacePopupElement = () => {
  return _replacePopupElement;
}

const createLayerPopupElement = (data) => {
  _layerPopupElement = data;
}
export const getLayerPopupElement = () => {
  return _layerPopupElement;
}

const LayoutPosition = (info) => {

  const category_list = {
    'title': '카테고리', 
    'itemlist': info.data.scenarioLabelInfo?.category,
  };
  const sub_category_list = {
    'title': '하위 카테고리', 
    'itemlist': info.data.scenarioLabelInfo?.subCategory,
  };
  const keyword_list = {
    'title': '대화 주제 키워드', 
    'itemlist': info.data.scenarioLabelInfo?.keyword,
  };
  const conversationSpeakers_list = {
    'title': '대화 주체', 
    'itemlist': info.data.scenarioLabelInfo?.conversationSpeakers,
  };
  const opinion_list = {
    'title': '평판', 
    'itemlist': info.data.scenarioLabelInfo?.opinion,
  };

  return (
    <>
      <section id={"video_layout"} className={styles.video_layout}>
        <VideoLayout video_info={info.data}></VideoLayout>
      </section>
      <section id={"program_layout"} style={{'backgroundColor':'#ebecf2', 'borderLeft': '3px solid', 'width':'25vw'}} className={styles.video_layout}>
        <section className={styles.subtitle_edit_content_thumbnail} style={{'maxHeight':'40px'}}>
            <div style={{'minWidth':'150px'}}>시나리오 정보</div>
            <div style={{'width': '100%'}}>
              전체 글자수
              <span>{''}</span>
            </div>
        </section>
        <SelectItem key={`${category_list.title}`} response={category_list} setitem={info.data.scenarioSelLabelInfo.category}></SelectItem>
        <SelectItem key={`${sub_category_list.title}`} response={sub_category_list} setitem={info.data.scenarioSelLabelInfo.subCategory}></SelectItem>
        <SelectItem key={`${keyword_list.title}`} response={keyword_list} setitem={info.data.scenarioSelLabelInfo.keyword}></SelectItem>
        <SelectItem key={`${conversationSpeakers_list.title}`} response={conversationSpeakers_list} setitem={info.data.scenarioSelLabelInfo.conversationSpeakers}></SelectItem>
        <SelectItem key={`${opinion_list.title}`} response={opinion_list} setitem={info.data.scenarioSelLabelInfo.opinion}></SelectItem>
        {/* <SelectItem key={`${category_list.title}`} response={category_list} setitem={info.data.scenarioSelLabelInfo.category}></SelectItem> */}
        {
          // select_item_list.map((arr, idx) => {
          //   return (
          //     <SelectItem key={`${arr.title}_${idx}`} response={arr}></SelectItem>
          //   )
          // })
        }
      </section>
      <section id={"shortcut_layout"} style={{'overflow':'auto', 'backgroundColor':'#ebecf2', 'borderLeft': '3px solid', 'width':'25vw', 'padding': '10px'}} className={styles.video_layout}>
            
            <div className={styles.tips}>
              <span style={{'gridArea': 'form1', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>입력 키</span>  <span style={{'gridArea': 'form2', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>선택효과</span>
              <span className={styles.header_tips} style={{'gridArea': 'age0'}}>발화자 연령</span>
              <span style={{'gridArea': 'age1', 'border': '1px solid'}}>1</span>  <span style={{'gridArea': 'age2', 'border': '1px solid'}}>미취학(5~7)</span>
              <span style={{'gridArea': 'age3', 'border': '1px solid'}}>2</span>  <span style={{'gridArea': 'age4', 'border': '1px solid'}}>초등저학년(8~10)</span>
              <span style={{'gridArea': 'age5', 'border': '1px solid'}}>3</span>  <span style={{'gridArea': 'age6', 'border': '1px solid'}}>초등고학년(11~13)</span>
              <span style={{'gridArea': 'age7', 'border': '1px solid'}}>4</span>  <span style={{'gridArea': 'age8', 'border': '1px solid'}}>청소년및성인(14이상)</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'sex0'}}>성별</span>
              <span style={{'gridArea': 'sex1', 'border': '1px solid'}}>q</span>  <span style={{'gridArea': 'sex2', 'border': '1px solid'}}>남자</span>
              <span style={{'gridArea': 'sex3', 'border': '1px solid'}}>w</span>  <span style={{'gridArea': 'sex4', 'border': '1px solid'}}>여자</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'place0'}}>장소</span>
              <span style={{'gridArea': 'place1', 'border': '1px solid'}}>a</span>  <span style={{'gridArea': 'place2', 'border': '1px solid'}}>집</span>
              <span style={{'gridArea': 'place3', 'border': '1px solid'}}>b</span>  <span style={{'gridArea': 'place4', 'border': '1px solid'}}>학교/학원</span>
              <span style={{'gridArea': 'place5', 'border': '1px solid'}}>d</span>  <span style={{'gridArea': 'place6', 'border': '1px solid'}}>식당/카페</span>
              <span style={{'gridArea': 'place7', 'border': '1px solid'}}>f</span>  <span style={{'gridArea': 'place8', 'border': '1px solid'}}>상점</span>
              <span style={{'gridArea': 'place9', 'border': '1px solid'}}>g</span>  <span style={{'gridArea': 'place10', 'border': '1px solid'}}>교통수단</span>
              <span style={{'gridArea': 'place11', 'border': '1px solid'}}>h</span>  <span style={{'gridArea': 'place12', 'border': '1px solid'}}>스튜디오</span>
              <span style={{'gridArea': 'place13', 'border': '1px solid'}}>j</span>  <span style={{'gridArea': 'place14', 'border': '1px solid'}}>실외</span>
              <span style={{'gridArea': 'place15', 'border': '1px solid'}}>k</span>  <span style={{'gridArea': 'place16', 'border': '1px solid'}}>기타상세</span>

              <span className={styles.header_tips} style={{'gridArea': 'util0'}}>기타</span>
              <span style={{'gridArea': 'util1', 'border': '1px solid'}}>shift + enter</span>  <span style={{'gridArea': 'util2', 'border': '1px solid'}}>저장</span>
              <span style={{'gridArea': 'util3', 'border': '1px solid'}}>ctrl + .</span>  <span style={{'gridArea': 'util4', 'border': '1px solid'}}>배속증가</span>
              <span style={{'gridArea': 'util5', 'border': '1px solid'}}>ctrl + ,</span>  <span style={{'gridArea': 'util6', 'border': '1px solid'}}>배속감소</span>
              <span style={{'gridArea': 'util7', 'border': '1px solid'}}>\ 또는 &#93;</span>  <span style={{'gridArea': 'util8', 'border': '1px solid'}}>일시정지 상태면 재생, 재생 상태면 일시정지</span>
            </div>

      </section>
      {/* <section style={{'display':'flex', 'flexDirection': 'column', 'textAlign': 'center', 'paddingRight': '20px'}}>
        <div>검수 반려 의견</div>
        <div className={styles.subtitle_label_content_third_column} style={{'margin': '0'}}>
          <textarea className={styles.subtitle_board} style={{'padding': '10px', 'height': '25vh'}}
            
          >
          </textarea>
        </div>
      </section> */}
    </>
  )
}

export default function Edit({ data }) {
  // console.log(data.label_info)
  const layerPopupRefElement = useRef(null);
  // const searchStringRefElement = useRef(null);
  const replacePopupRefElement = useRef(null);
  createSubtitleInfo(data);
  
  useEffect(() => {
    createLayerPopupElement(layerPopupRefElement);
    createReplacePopupElement(replacePopupRefElement);
    localStorage.setItem('episodDTO', JSON.stringify(data.label_info.episodDTO));
    localStorage.setItem('scenarioLabelInfo', JSON.stringify(data.label_info.scenarioLabelInfo));
    localStorage.setItem('scenarioSelLabelInfo', JSON.stringify(data.label_info.scenarioSelLabelInfo));
    localStorage.setItem('subtitleLabelInfo', JSON.stringify(data.label_info.subtitleLabelInfo));

  }, [data]);

  return (
    <>
      <article id={"edit_top_layout"} className={styles.container} style={{'backgroundColor': '#ebecf2', 'overflow': 'auto'}}>
        <LayoutPosition video_position={data.video_position} data={data.label_info}></LayoutPosition>
      </article>
      <section style={{'display': 'flex', 'justifyContent': 'center', 'maxHeight': '30px'}}>
          <span>
            문장 라벨
            <span className={'mr-3 ml-3'}>{`0/${data.label_info.subtitleList.length}`}</span>
            입력 완료
          </span>
      </section>
      <article id={"subtitle_edit_layout"} className={styles.subtitle_edit_layout} style={{'height': 'calc(55vh - 30px)'}}>
          <Subtitle info={data.label_info} key={data.EP_AIN}></Subtitle>
      </article>
    </>
  )
}

export async function getServerSideProps(context) {
  // export async function getStaticProps(context) {
  // Fetch data from external API
  let prgAin = context.query.prgAin;
  let epAin = context.query.epAin;
  let epVdoSnm = context.query.epVdoSnm;
  let jobStat = context.query.jobStat;
  const req = context.req;
  const res = context.res;
  const cookie = getCookie('tmp', {req, res});
  if(cookie == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/common/illegal'
      }
    }
  }

  const user_info = JSON.parse(cookie);
  let label_param = {
    'userInfo': {
      "prtEml": user_info?.prtEml
      // 'prtEml': 'raelee@datacrush.ai'
    },
    'episodDTO': {
      'prgAin': prgAin,
      'epAin': epAin,
      'epVdoSnm': epVdoSnm,
    }
  }
  
  let label_url = '/labeltool/getLabelJobForScenario';

  if( jobStat == 'ING') {
    label_url = '/labeltool/getLabelJobIngForScenario';
  }

  const label_info = await sendFetch(label_url, label_param, {method: 'POST'});
  
  let shortcut_list = [];
  // let user_set = ['F3', 'F4', 'F8', 'F9', 'Shift + Enter', 'Ctrl + Enter', 'Alt + Enter', 'Ctrl + ,', 'Ctrl + .', '=', '방향키 왼쪽, 오른쪽'];
  let user_set = ['F8', 'F9', 'Shift + Enter', 'Ctrl + Enter', 'Alt + Enter', 'Ctrl + ,', 'Ctrl + .', '=', '방향키 왼쪽, 오른쪽'];

  for (let idx = 0; idx < user_set.length; idx++) {
    let shortcut = {
      'key': '',
      'description': '',
    };
    shortcut.key = user_set[idx];
    if (user_set[idx] == 'F8') {
      shortcut.description = '[파형막대 기준] 뒤에있는 파형에서 가장 가까운 시작시간을 현재 파형막대의 위치에 이동합니다.';
    }
    else if (user_set[idx] == 'F9') {
      shortcut.description = '[파형막대 기준] 가장 가까운 파형의 종료시간을 현재 파형막대의 위치에 이동합니다.';
    }
    // else if (user_set[idx] == 'F3') {
    //   shortcut.description = '파형의 구간겹치기가 가능하게 변합니다.';
    // }
    // else if (user_set[idx] == 'F4') {
    //   shortcut.description = '파형의 구간겹치기가 불가능하게 변합니다.';
    // }
    else if (user_set[idx] == 'Shift + Enter') {
      shortcut.description = '임시저장을 합니다.';
    }
    else if (user_set[idx] == 'Ctrl + Enter') {
      shortcut.description = '다음 자막과 병합을 합니다.';
    }
    else if (user_set[idx] == 'Alt + Enter') {
      shortcut.description = '커서 기준으로 자막 분할을 합니다.';
    }
    else if (user_set[idx] == 'Ctrl + ,') {
      shortcut.description = '영상의 배속을 0.1배 감소 시킵니다.';
    }
    else if (user_set[idx] == 'Ctrl + .') {
      shortcut.description = '영상의 배속을 0.1배 증가 시킵니다.';
    }
    else if (user_set[idx] == '=') {
      shortcut.description = '영상의 현재 시간에 피드백을 작성합니다.';
    }
    else if (user_set[idx] == '방향키 왼쪽, 오른쪽') {
      shortcut.description = '파형을 클릭 한 후, 방향키 왼쪽과 오른쪽으로 영상의 시간을 변경합니다.';
    }

    shortcut_list.push(shortcut);
  }


  if( label_info.subtitleList == null && jobStat != 'ING') {
    const _aspath = `/common/edit?epAin=${epAin}&epVdoSnm=${epVdoSnm}&prgAin=${prgAin}&jobStat=ING`;
    return {
      redirect: {
        permanent: false,
        destination: _aspath,
      }
    }
  }
  else if( label_info.subtitleList == null && jobStat == 'ING') {
    return {
      notFound: true,
    }
  }

  if( label_info?.rst?.rstCd == '301' ) {
    return {
      redirect: {
        permanent: false,
        destination: '/common/fulltask'
      }
    }
  }

  const data = {
    'layout': 'edit',
    'video_position': 'left',
    'epAin': epAin,
    'prgAin': prgAin,
    'epVdoSnm': epVdoSnm,
    'label_info': label_info,
    'shortcut': shortcut_list,
    'data': [{ "subSnm": 0, "subCn": "", "subBgnHrMs": "", "subEndHrMs": "" }]
  };
  // Pass data to the page via props
  return { props: { data } }
}

Edit.title = 'VIVO_편집';

// export async function getStaticProps(context) {
//   // const data = resize();  
//   const data = "asdas";
//   return {
//       props: { data }
//   };
// };