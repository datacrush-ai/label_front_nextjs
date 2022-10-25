import { getHost } from '../../../config/serverconfig';
import ProgramList, { re_process_click } from './program_list';
import PieChart, { re_pie_click } from '../../common/pie_chart';
import DetailLabelList from './detail_label_list';
import UserProcessList from './user_process_list';
import UserRejectList from './user_reject_list';
import DetailAcceptList from './detail_accept_list';
import AcceptProcessList from './accept_process_list';
import AcceptRejectList from './accept_reject_list';
import { sendFetch } from '../../common/common_script';
import { getCookie } from 'cookies-next';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import { useRef, useEffect } from 'react';
import CustomSetPopup from '../../common/custom_set_popup';
import styles from '../../../styles/Layout.module.css'

const fetcher = (url, param, options) => sendFetch(url, param, options);
const DASHBOARD_API = '/labeltool/getBasicInfoForDashboard';
let _layerPopupRefElement;

const createLayerPopupRefElement = (data) => {
  _layerPopupRefElement = data;
}
export const getLayerPopupRefElement = () => {
  return _layerPopupRefElement;
}

/**
 * 프롣그램 상세 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
const ConditionDetailList = ({userinfo, response}) => {
  // console.log(userinfo)
  if(userinfo.author === 'accept') {
    return(
      <DetailAcceptList response={response}></DetailAcceptList>
    )
  }
  else {
    return(
      <DetailLabelList response={response}></DetailLabelList>
    )
  }
}

/**
 * 라벨 작업 중 목록 / 검수 작업 중 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
const ConditionProcessList = ({userinfo, response}) => {
  useEffect(() => {
    
  }, [response]);
  if(userinfo.author === 'accept') {
    return(
      <AcceptProcessList response={response}></AcceptProcessList>
    )
  }
  else {
    return(
      <UserProcessList response={response}></UserProcessList>
    )
  }
}

/**
 * 검수 반려 목록 / 재검수 요청 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
const ConditionRejectList = ({userinfo, response}) => {
  if(userinfo.author === 'accept') {
    return(
      <AcceptRejectList response={response}></AcceptRejectList>
      // <UserRejectList response={response}></UserRejectList>
    )
  }
  else {
    return(
      <UserRejectList response={response}></UserRejectList>
    )
  }
}

export default function Dashboard({response, param, cookie}) {
  // /*
  const { mutate } = useSWRConfig();
  const layerPopupRefElement = useRef(null);
  createLayerPopupRefElement(layerPopupRefElement);

  mutate(DASHBOARD_API, async() => {
    await re_process_click();
    await re_pie_click();
    return await sendFetch(DASHBOARD_API, response, {method: "POST"});
  // }, { focusThrottleInterval: 10000 });
  }, { 
    revalidate: false,
    // optimisticData: response,
    // revalidateIfStale: false,
    // revalidateOnMount: false,
  });
  
  let { data, error } = useSWR(DASHBOARD_API, fetcher, {
  // let { data, error } = useSWRImmutable(DASHBOARD_API, fetcher, {
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });

  // const response = await fetcher(DASHBOARD_API, param, options);
  // console.log(response)
  // let { data, error } = useSWR({DASHBOARD_API, param}, fetcher, {
  
  if( data == undefined ) {
    data = response;
  }

  // console.log(data);
  // let { data, error } = useSWR(DASHBOARD_API, fetcher);
  
  
  // */

  /*
  useEffect(() => {
    const user_info = JSON.parse(cookie);
    const param = {
      "userInfo": {
          "prtEml": user_info.prtEml
      }
    };
    
    sendFetch(DASHBOARD_API, param, {method: "POST"});
  }, [cookie, data]);
  */
  
  
  // console.log('res = ', response?.epListJobIng)
  // console.log('data = ', data?.epListPerPrg)
  // console.log(data)

  // const data = response;
  // let result = response;
  // console.log(result)
  let userinfo = {};
  // userinfo.author = 'accept';
  userinfo.author = 'labler';
  // result.program_list = data.epListJobIng;
  // result.video_url = 'https://vivo.best/samgwang/PS-2021024074-01-000.m3u8',
  // result.mp3_url = 'https://datacrush-subtitle.s3.ap-northeast-2.amazonaws.com/AP392/AP392001P1/AP392001P1.mp3',
  // result.subtitle_url = 'https://datacrush-subtitle.s3.ap-northeast-2.amazonaws.com/AP392/AP392001P1/AP392001P1_36byte.vtt',
  // result.wavepeak_url = 'https://datacrush-subtitle.s3.ap-northeast-2.amazonaws.com/AP392/AP392001P1/AP392001P1_peak.json',
  data.layout = 'edit',
  data.video_position = 'right',
  data.EP_AIN = '1',
  data.PRG_AIN = '1',
  data.shortcut = [
    {
      key: 'F8',
      description: '[파형막대 기준] 뒤에있는 파형에서 가장 가까운 시작시간을 현재 파형막대의 위치에 이동합니다.'
    },
    {
      key: 'F9',
      description: '[파형막대 기준] 가장 가까운 파형의 종료시간을 현재 파형막대의 위치에 이동합니다.'
    },
    { key: 'Shift + Enter', description: '임시저장을 합니다.' },
    { key: 'Ctrl + Enter', description: '다음 자막과 병합을 합니다.' },
    { key: 'Alt + Enter', description: '커서 기준으로 자막 분할을 합니다.' },
    { key: 'Ctrl + ,', description: '영상의 배속을 0.1배 감소 시킵니다.' },
    { key: 'Ctrl + .', description: '영상의 배속을 0.1배 증가 시킵니다.' },
    { key: '=', description: '영상의 현재 시간에 피드백을 작성합니다.' },
    {
      key: '방향키 왼쪽, 오른쪽',
      description: '파형을 클릭 한 후, 방향키 왼쪽과 오른쪽으로 영상의 시간을 변경합니다.'
    }
  ];

  return (
    <SWRConfig value={{data}}>
      <main className={"flex flex-row px-6 py-6 h-[95vh]"}>
        {/* 왼쪽 프로그램 목록 */}
        <section className={"w-1/3 min-w-[340px] px-3 py-3 bg-whiteblue100"}>
          {/* <SearchBox></SearchBox> */}
          <div style={{'textAlign': 'center', 'height': '40px'}}>
            <span style={{'color': 'var(--theme-blue-color)', 'fontSize': '20px'}}>{response.userInfo.prtNm}</span>
            님 환영합니다.</div>
          <ProgramList response={data?.prgList}></ProgramList>
        </section>
        
        {/* 오른쪽 */}
        <section className={"w-2/3 px-5"}>
          
          {/* 오른쪽 프로그램 진행 차트, 상세목록 */}
          <section className={"flex w-full h-[50vh] box-sizing-content"}>
            
            {/* 차트 */}
            <section className={"w-1/2 mr-4 bg-whiteblue100"}>
              <PieChart></PieChart>
            </section>
            {/* 차트 끝 */}
            
            {/* 상세목록 */}
            <section className={"w-1/2 ml-4 bg-whiteblue100"}>
              <ConditionDetailList userinfo={userinfo} response={data?.epListJobIng}></ConditionDetailList>
            </section>
            {/* 상세목록 끝 */}

          </section>
          {/* 오른쪽 프로그램 진행 차트, 상세목록 끝 */}

          {/* 라벨 작업 중 목록 / 검수 작업 중 목록 */}
          <section className={"flex w-full mt-6 h-[35vh]"}>
            {/* <ConditionProcessList userinfo={userinfo} response={data.epListJobIng}></ConditionProcessList> */}
            <UserProcessList response={data?.epListJobIng}></UserProcessList>
          </section>

          {/* 검수 반려 목록 / 재검수 요청 목록 */}
          {/* <section className={"flex w-full mt-6 h-[22.5vh-50px] border-y-1"}>
            <ConditionRejectList userinfo={userinfo} response={result.epListJobIng}></ConditionRejectList>
          </section> */}

        </section>
        <section ref={layerPopupRefElement} id={"help_layer_popup"} className={styles.layer_popup} style={{ "display": "none", 'zIndex': '40' }}>
          <CustomSetPopup response={data?.epListJobCpl}></CustomSetPopup>
        </section>
      </main>
    </SWRConfig>
  )
}


export async function getServerSideProps(context) {
  let data = '';
  if( context.query.token == undefined || context.query.token == null || context.query.token == '') {
    data = '';
  }
  else {
    data = context.query.token;
  }
  let host = getHost();
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
  // /*
  const user_info = JSON.parse(cookie);
  const param = {
    "userInfo": {
        "prtEml": user_info.prtEml
    }
  };
  
  const options = {
    'method': 'POST'
  }

  const response = await fetcher(DASHBOARD_API, param, options);
  // */
  
  return { 
    props: { 
      cookie,
      param,
      response,
      // fallback: {
      //   DASHBOARD_API: param
      // },
    } 
  }
}