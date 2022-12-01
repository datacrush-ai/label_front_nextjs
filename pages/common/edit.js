import styles from '../../styles/Layout.module.css';
import VideoLayout from './video_layout';
import React, { useEffect } from "react";
import { useRef } from 'react';
import Subtitle from './subtitle';
import SelectItem from './select_item';
import { sendFetch, ToastMsg } from './common_script';
import { getCookie } from 'cookies-next';
import SearchBoxAutoComplete from './searchbox_autocomplete';
import { getMacro } from '../../store/nia_layout/StoreMacroSlice';
import { useSelector } from 'react-redux';

let _layerPopupElement;
let _replacePopupElement;
let _getSubtitleInfo;
let _macro;
let intervalMessage;

export const getFuncMacro = () => {
  return _macro;
}

const createFuncMacro = (data) => {
  _macro = data;
}

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
      <section id={"video_layout"} className={styles.video_layout} style={{'width': '40vw'}}>
        <VideoLayout video_info={info.data}></VideoLayout>
      </section>
      <section id={"program_layout"} style={{'width':'26vw', 'backgroundColor':'#ebecf2', 'borderLeft': '3px solid', 'minWidth': '250px', 'minHeight': '300px', 'overflow': 'auto'}} className={styles.video_layout}>
        <section className={styles.subtitle_edit_content_thumbnail} style={{'maxHeight':'40px'}}>
            <div style={{'minWidth':'150px'}}>시나리오 정보</div>
            <div style={{'width': '100%'}}>
              전체 글자수
              <span>{''}</span>
            </div>
        </section>
        <SelectItem key={`${category_list?.title}`} response={category_list} setitem={info.data?.scenarioSelLabelInfo?.category}></SelectItem>
        {/* <SelectItem key={`${sub_category_list.title}`} response={sub_category_list} setitem={info.data.scenarioSelLabelInfo.subCategory}></SelectItem> */}
        <SearchBoxAutoComplete key={`${sub_category_list.title}`} placeholder={'하위카테고리를 입력하세요'} dataListName={'subcategory-options'} dataList={sub_category_list} index={''} setItem={info.data.scenarioSelLabelInfo.subCategory} title={'하위 카테고리'} minWidth={'250px'} titleMinWidth={'120px'}></SearchBoxAutoComplete>
        <SelectItem key={`${keyword_list.title}`} response={keyword_list} setitem={info.data.scenarioSelLabelInfo.keyword}></SelectItem>
        {/* <SearchBoxAutoComplete key={`${keyword_list.title}`} placeholder={'대화주제 키워드를 입력하세요'} dataListName={'keyword-options'} dataList={keyword_list} index={''} setItem={info.data.scenarioSelLabelInfo.keyword} title={'대화 주제 키워드'} minWidth={'250px'} titleMinWidth={'120px'}></SearchBoxAutoComplete> */}
        <SelectItem key={`${conversationSpeakers_list.title}`} response={conversationSpeakers_list} setitem={info.data.scenarioSelLabelInfo.conversationSpeakers}></SelectItem>
        {/* <SelectItem key={`${opinion_list.title}`} response={opinion_list} setitem={info.data.scenarioSelLabelInfo.opinion}></SelectItem> */}
        <SearchBoxAutoComplete key={`${opinion_list.title}`} placeholder={'평판을 입력하세요'} dataListName={'opinion-options'} dataList={opinion_list} index={''} setItem={info.data.scenarioSelLabelInfo.opinion} title={'평판'} minWidth={'250px'} titleMinWidth={'120px'}></SearchBoxAutoComplete>
        {/* <SelectItem key={`${category_list.title}`} response={category_list} setitem={info.data.scenarioSelLabelInfo.category}></SelectItem> */}
        {
          // select_item_list.map((arr, idx) => {
          //   return (
          //     <SelectItem key={`${arr.title}_${idx}`} response={arr}></SelectItem>
          //   )
          // })
        }
      </section>
      <div style={{'fontWeight': 'bold', 'color': 'var(--theme-blue-font)', 'width': '11rem'}}>
        화자 매크로에 화자, 발화자 연령, 성별을 입력하고
        <br></br>
        자막에 화자만 입력하면 
        <br></br>
        지정한 발화자 연령, 성별을&#160;
        <span style={{'color': 'red'}}>
          자동으로 입력합니다.
        </span>
      </div>
      <section id={"shortcut_layout"} style={{'overflow':'auto', 'backgroundColor':'#ebecf2', 'borderLeft': '3px solid', 'width':'40vw', 'padding': '10px', 'flexDirection': 'column-reverse'}} className={styles.video_layout}>
            <div className={styles.tips}>
              <span style={{'gridArea': 'form1', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>입력 키</span>  <span style={{'gridArea': 'form2', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>선택효과</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'util0'}}>기타</span>
              <span style={{'gridArea': 'util1', 'border': '1px solid'}}>shift + enter</span>  <span style={{'gridArea': 'util2', 'border': '1px solid'}}>저장</span>
              <span style={{'gridArea': 'util3', 'border': '1px solid'}}>ctrl + .</span>  <span style={{'gridArea': 'util4', 'border': '1px solid'}}>배속증가</span>
              <span style={{'gridArea': 'util5', 'border': '1px solid'}}>ctrl + ,</span>  <span style={{'gridArea': 'util6', 'border': '1px solid'}}>배속감소</span>
              <span style={{'gridArea': 'util7', 'border': '1px solid'}}>\ 또는 &#93;</span>  <span style={{'gridArea': 'util8', 'border': '1px solid'}}>(일시정지 상태) 재생 / (재생 상태) 일시정지</span>
              <span style={{'gridArea': 'util9', 'border': '1px solid'}}>c</span>  <span style={{'gridArea': 'util10', 'border': '1px solid'}}>(라인 선택시) 해당 라인 라벨 복사</span>
              <span style={{'gridArea': 'util11', 'border': '1px solid'}}>v</span>  <span style={{'gridArea': 'util12', 'border': '1px solid'}}>(라인 선택시) 복사한 라인 라벨을 해당라인에 붙여넣기</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'macro0'}}>화자 매크로</span>
              <span style={{'gridArea': 'macro1', 'border': '1px solid'}}>1</span>  <span style={{'gridArea': 'macro2', 'border': '1px solid'}}>화자 매크로1</span>
              <span style={{'gridArea': 'macro3', 'border': '1px solid'}}>2</span>  <span style={{'gridArea': 'macro4', 'border': '1px solid'}}>화자 매크로2</span>
              <span style={{'gridArea': 'macro5', 'border': '1px solid'}}>3</span>  <span style={{'gridArea': 'macro6', 'border': '1px solid'}}>화자 매크로3</span>
              <span style={{'gridArea': 'macro7', 'border': '1px solid'}}>4</span>  <span style={{'gridArea': 'macro8', 'border': '1px solid'}}>화자 매크로4</span>
              <span style={{'gridArea': 'macro9', 'border': '1px solid'}}>5</span>  <span style={{'gridArea': 'macro10', 'border': '1px solid'}}>화자 매크로5</span>
              <span style={{'gridArea': 'macro11', 'border': '1px solid'}}>6</span>  <span style={{'gridArea': 'macro12', 'border': '1px solid'}}>화자 매크로6</span>
              <span style={{'gridArea': 'macro13', 'border': '1px solid'}}>7</span>  <span style={{'gridArea': 'macro14', 'border': '1px solid'}}>화자 매크로7</span>
              <span style={{'gridArea': 'macro15', 'border': '1px solid'}}>8</span>  <span style={{'gridArea': 'macro16', 'border': '1px solid'}}>화자 매크로8</span>
              <span style={{'gridArea': 'macro17', 'border': '1px solid'}}>9</span>  <span style={{'gridArea': 'macro18', 'border': '1px solid'}}>화자 매크로9</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'place0'}}>장소</span>
              <span style={{'gridArea': 'place1', 'border': '1px solid'}}>a</span>  <span style={{'gridArea': 'place2', 'border': '1px solid'}}>집</span>
              <span style={{'gridArea': 'place3', 'border': '1px solid'}}>s</span>  <span style={{'gridArea': 'place4', 'border': '1px solid'}}>학교/학원</span>
              <span style={{'gridArea': 'place5', 'border': '1px solid'}}>d</span>  <span style={{'gridArea': 'place6', 'border': '1px solid'}}>식당/카페</span>
              <span style={{'gridArea': 'place7', 'border': '1px solid'}}>f</span>  <span style={{'gridArea': 'place8', 'border': '1px solid'}}>상점</span>
              <span style={{'gridArea': 'place9', 'border': '1px solid'}}>g</span>  <span style={{'gridArea': 'place10', 'border': '1px solid'}}>교통수단</span>
              <span style={{'gridArea': 'place11', 'border': '1px solid'}}>h</span>  <span style={{'gridArea': 'place12', 'border': '1px solid'}}>세트장</span>
              <span style={{'gridArea': 'place13', 'border': '1px solid'}}>j</span>  <span style={{'gridArea': 'place14', 'border': '1px solid'}}>실외</span>
              
              <span className={styles.header_tips} style={{'gridArea': 'ovr0'}}>중첩음</span>
              <span style={{'gridArea': 'ovr1', 'border': '1px solid'}}>q</span>  <span style={{'gridArea': 'ovr2', 'border': '1px solid'}}>없음</span>
              <span style={{'gridArea': 'ovr3', 'border': '1px solid'}}>w</span>  <span style={{'gridArea': 'ovr4', 'border': '1px solid'}}>다화자</span>
              <span style={{'gridArea': 'ovr5', 'border': '1px solid'}}>e</span>  <span style={{'gridArea': 'ovr6', 'border': '1px solid'}}>배경음</span>
              <span style={{'gridArea': 'ovr7', 'border': '1px solid'}}>r</span>  <span style={{'gridArea': 'ovr8', 'border': '1px solid'}}>기타</span>
              <span style={{'gridArea': 'ovr9', 'border': '1px solid'}}>t</span>  <span style={{'gridArea': 'ovr10', 'border': '1px solid'}}>소리없음</span>
              
            </div>

            <div id={'speaker-dependency'} style={{'backgroundColor': 'antiquewhite'}}>
              <SpeakerDependency label_info={info.data} depend={info.depend}></SpeakerDependency>
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

const MacroLayer = () => {
  let macro = getFuncMacro();
  let resultHtml = '';
  let convertKey = {
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
  };
  for(let idx=1; idx<10; idx++) {
    if( macro ) {
      if( macro[idx]?.speakerAge?.labelNm ) {
        if( macro[idx]?.speakerOvrVoc?.labelNm == '선택하세요' ) {
          resultHtml += `<p>${idx}번 매크로 [입력 키: ${convertKey[idx]}]: ${macro[idx]?.speakerAge?.labelNm}-${macro[idx]?.speakerSex?.labelNm}-${macro[idx]?.placeType?.labelNm}-${macro[idx]?.speaker?.labelNm}-없음</p>`
        }
        else {
          resultHtml += `<p>${idx}번 매크로 [입력 키: ${convertKey[idx]}]: ${macro[idx]?.speakerAge?.labelNm}-${macro[idx]?.speakerSex?.labelNm}-${macro[idx]?.placeType?.labelNm}-${macro[idx]?.speaker?.labelNm}-${macro[idx]?.speakerOvrVoc?.labelNm}</p>`
        }
      }
    }
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: resultHtml }}></div>
  )
}

const SpeakerDependency = ({label_info, depend}) => {
  // depend = JSON.parse(depend);
  const age_list = {
    'title': '발화자 연령', 
    'itemlist': label_info.subtitleLabelInfo.speakerAge
  };
  const sex_list = {
    'title': '성별', 
    'itemlist': label_info.subtitleLabelInfo.speakerSex
  };
  const speaker_list = {
    'title': '화자',
    'itemlist': label_info.subtitleLabelInfo.speaker
  }

  const length = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  
  if( typeof(depend) == 'string' ) {
    depend = JSON.parse(depend);
  }
  
  let largefontSize = '1rem';
  let fontSize = '0.7rem';

  if(depend.length > 0) {
    //로컬스토리지에 값이 있을 경우
    return(
      depend.map((arr, idx) => {
        return (
          <section key={idx} style={{'display':'flex', 'justifyContent': 'space-evenly', 'alignItems': 'center', 'fontSize': fontSize, 'whiteSpace': 'nowrap'}}>{`화자 매크로${idx+1}`} 
              <div style={{'width': '100px', 'cursor': 'text','display': 'flex','backgroundColor': 'rgb(255, 255, 255)','borderRadius': '10px','border': '1px solid rgb(229, 232, 235)','padding': '0px 10px'}}>
                  <input style={{'padding': '10px 0px', 'fontSize': largefontSize}} type={"text"} className={styles.ibx_product} placeholder={'메모'} defaultValue={arr.memo}/>
              </div>
              <div style={{'padding': '0px'}}>
                <SearchBoxAutoComplete key={`speaker_${idx}`} setItem={'fake'} placeholder={'화자를 입력하세요'} dataListName={'speaker-options'} dataList={speaker_list} index={idx} title={'화자'} maxWidth={'250px'} defaultvalue={arr.speaker} fontSize={fontSize}></SearchBoxAutoComplete>
              </div>
              <div style={{'padding': '0px'}}>
                <SelectItem key={`age`} response={age_list} types={'fake'} defaultvalue={arr.ageidx} setitem={arr.agecd} fontSize={fontSize}></SelectItem>
              </div>
              <div style={{'padding': '0px'}}>
                <SelectItem key={`sex`} response={sex_list} types={'fake'} defaultvalue={arr.sexidx} setitem={arr.sexcd} fontSize={fontSize}></SelectItem>
              </div>
          </section>
        )
      })
    )
  }
  else {
    //로컬스토리지에 값이 없을 경우
    return(
      length.map((arr, idx) => {
        return (
          <section key={idx} style={{'display':'flex', 'justifyContent': 'space-evenly', 'alignItems': 'center', 'fontSize': fontSize, 'whiteSpace': 'nowrap'}}>{`화자 매크로${idx+1}`} 
              <div style={{'width': '100px', 'cursor': 'text','display': 'flex','backgroundColor': 'rgb(255, 255, 255)','borderRadius': '10px','border': '1px solid rgb(229, 232, 235)','padding': '0px 10px'}}>
                  <input style={{'padding': '10px 0px', 'fontSize': largefontSize}} type={"text"} className={styles.ibx_product} placeholder={'메모'}/>
              </div>
              <div style={{'padding': '0px'}}>
                <SearchBoxAutoComplete key={`speaker_${idx}`} setItem={'fake'} placeholder={'화자를 입력하세요'} dataListName={'speaker-options'} dataList={speaker_list} index={idx} title={'화자'} maxWidth={'250px'} fontSize={fontSize}></SearchBoxAutoComplete>
              </div>
              <div style={{'padding': '0px'}}>
                <SelectItem key={`age`} response={age_list} types={'fake'} fontSize={fontSize}></SelectItem>
              </div>
              <div style={{'padding': '0px'}}>
                <SelectItem key={`sex`} response={sex_list} types={'fake'} fontSize={fontSize}></SelectItem>
              </div>
          </section>
        )
      })
    )
  }
}

const getAlarm = () => {
  return JSON.parse(localStorage.getItem('alarm'));
}

export default function Edit({ data }) {
  const layerPopupRefElement = useRef(null);
  const replacePopupRefElement = useRef(null);
  const macro = useSelector(getMacro);
  createFuncMacro(macro);
  createSubtitleInfo(data);
  useEffect(() => {
    clearInterval(intervalMessage);
    intervalMessage = setInterval(async() => {
      const ALARM_URL = '/labeltool/getNotice';
      const param = {
        'userInfo': {
          'prtEml': data.cookie?.['prtEml']
        }
      };
      const alarm_msg = await sendFetch(ALARM_URL, param, {method: 'POST'});
      const alarm = getAlarm();

      if( (alarm?.start != alarm_msg?.notice?.ntcVldBgnDt) || (alarm?.end != alarm_msg?.notice?.ntcVldEndDt) && (alarm_msg.notice?.ntcTtl && alarm_msg.notice?.ntcCn)) {
        if( document.querySelector('body>div.toastify.on.toastify-right.toastify-bottom') ) {
          
          
        }
        else if(alarm_msg?.rst?.rstCd != '400') {
          ToastMsg(alarm_msg, 2000000, null, null, 'alert', '공지');
        }
      }
    }, 20000);
    
    const shortcut = document.getElementById('shortcut_layout');
    shortcut.scrollTop = -(shortcut.scrollHeight);
    createLayerPopupElement(layerPopupRefElement);
    createReplacePopupElement(replacePopupRefElement);
    localStorage.setItem('episodDTO', JSON.stringify(data.label_info.episodDTO));
    localStorage.setItem('scenarioLabelInfo', JSON.stringify(data.label_info.scenarioLabelInfo));
    localStorage.setItem('scenarioSelLabelInfo', JSON.stringify(data.label_info.scenarioSelLabelInfo));
    localStorage.setItem('subtitleLabelInfo', JSON.stringify(data.label_info.subtitleLabelInfo));
  }, [data, macro]);
  
  return (
    <>
      <article id={"edit_top_layout"} className={styles.container} style={{'backgroundColor': '#ebecf2', 'overflow': 'auto', 'height': '47vh'}}>
        <LayoutPosition video_position={data.video_position} data={data.label_info} depend={data.speakerdependency}></LayoutPosition>
      </article>
      {/* <section style={{'display': 'flex', 'justifyContent': 'center', 'maxHeight': '30px'}}> */}
      <section style={{'display': 'flex', 'justifyContent': 'center', 'minHeight': 'calc(6vh)', 'maxHeight': 'calc(6vh)', 'overflow': 'auto', 'textAlign': 'center'}}>
        <div>
          <span className={'mr-3 ml-3'} style={{'color': 'var(--theme-blue-color)'}}>
            매크로 지정: 해당 라인 마우스 우클릭
            <br></br>
            {data.label_info?.episodDTO?.prgNm}-{data.label_info?.episodDTO?.epNm}-{data.label_info?.episodDTO?.epVdoSnm}화
            <br></br>
            <MacroLayer></MacroLayer>
            {/* {`2번매크로: ${macro['2']?.speakerAge?.labelNm}-${macro['2']?.speakerSex?.labelNm}-${macro['2']?.placeType?.labelNm}-${macro['2']?.speaker?.labelNm}-${macro['2']?.speakerOvrVoc?.labelNm}`} */}
          </span>
        </div>
      </section>
      <article id={"subtitle_edit_layout"} className={styles.subtitle_edit_layout} style={{'height': 'calc(43vh - 30px)'}}>
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
  let speakerdependency = getCookie('speakerdependency', {req, res});

  if( speakerdependency == undefined ) {
    speakerdependency = [];
  }

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
  else if( jobStat == 'ERR') {
    label_url = '/labeltool/getExceptionEp';
  }
  else if( jobStat == 'ERR_ING') {
    label_url = '/labeltool/getExceptionEpJobIng';
  }
  
  const label_info = await sendFetch(label_url, label_param, {method: 'POST'});
  
  if( label_info.subtitleList == null && jobStat == 'ERR' ) {
    const _aspath = `/common/edit?epAin=${epAin}&epVdoSnm=${epVdoSnm}&prgAin=${prgAin}&jobStat=ERR_ING`;
    return {
      redirect: {
        permanent: false,
        destination: _aspath,
      }
    }
  }
  else if( label_info.subtitleList == null && jobStat == 'NEW') {
    const _aspath = `/common/edit?epAin=${epAin}&epVdoSnm=${epVdoSnm}&prgAin=${prgAin}&jobStat=ING`;
    return {
      redirect: {
        permanent: false,
        destination: _aspath,
      }
    }
  }
  else if( label_info.subtitleList == null && jobStat == 'ERR_ING') {
    return {
      notFound: true,
    }
  }
  else if( label_info.subtitleList == null && jobStat == 'ING') {
    return {
      notFound: true,
    }
  }

  if( label_info?.rst?.rstCd == '301' ) {
    //작업자에게 허용된 작업시간을 초과했을 때
    return {
      redirect: {
        permanent: false,
        destination: '/common/fulltask'
      }
    }
  }
  else if( label_info?.rst?.rstCd == '300' || label_info?.rst?.rstCd == '302' ) {
    //허용된 작업 인원이 아닐 때
    return {
      redirect: {
        permanent: false,
        destination: '/common/illegal'
      }
    }
  }
  else if( label_info?.rst?.rstCd == '303' ) {
    //최대 동시 작업 갯수 초과
    return {
      redirect: {
        permanent: false,
        destination: '/common/maxtask'
      }
    }
  }

  const data = {
    'cookie': user_info,
    'layout': 'edit',
    'video_position': 'left',
    'epAin': epAin,
    'prgAin': prgAin,
    'epVdoSnm': epVdoSnm,
    'label_info': label_info,
    'speakerdependency': speakerdependency,
    // 'shortcut': shortcut_list,
    'data': [{ "subSnm": 0, "subCn": "", "subBgnHrMs": "", "subEndHrMs": "" }]
  };
  // Pass data to the page via props
  return { props: { data } }
}

Edit.title = 'NIA_편집';

// export async function getStaticProps(context) {
//   // const data = resize();  
//   const data = "asdas";
//   return {
//       props: { data }
//   };
// };