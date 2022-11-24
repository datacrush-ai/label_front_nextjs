import { getHost } from '../../../config/serverconfig';
// import ProgramList, { re_process_click } from './program_list';
import { re_process_click } from './program_list';
import PieChart, { re_pie_click } from '../../common/pie_chart';
// import { re_pie_click } from '../../common/pie_chart';
// import DetailLabelList from './detail_label_list';
// import UserProcessList from './user_process_list';
// import UserRejectList from './user_reject_list';
import DetailAcceptList from './detail_accept_list';
// import AcceptProcessList from './accept_process_list';
// import AcceptRejectList from './accept_reject_list';
import { getUtilDate, sendFetch } from '../../common/common_script';
import { getCookie } from 'cookies-next';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import { useRef, useEffect } from 'react';
// import CustomSetPopup from '../../common/custom_set_popup';
import styles from '../../../styles/Layout.module.css'
import dynamic from 'next/dynamic';

const fetcher = (url, param, options) => sendFetch(url, param, options);
const DASHBOARD_API = '/labeltool/getExceptionEpList';

let _layerPopupRefElement;
let _payLayerPopupRefElement;

const createLayerPopupRefElement = (data) => {
  _layerPopupRefElement = data;
}
export const getLayerPopupRefElement = () => {
  return _layerPopupRefElement;
}
const createPayLayerPopupRefElement = (data) => {
  _payLayerPopupRefElement = data;
}
export const getPayLayerPopupRefElement = () => {
  return _payLayerPopupRefElement;
}

/**
 * 프롣그램 상세 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
/*
const ConditionDetailList = ({userinfo, response}) => {
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
*/

/**
 * 라벨 작업 중 목록 / 검수 작업 중 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
/*
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
*/

/**
 * 검수 반려 목록 / 재검수 요청 목록
 * @userinfo {JSON} 'user 정보'
 * @response {JSON} '화면에 표시할 데이터'
 * @returns 
 */
/*
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
*/

export default function Dashboard({response, param}) {
  // /*

  const utilDate = getUtilDate(new Date());
  const { mutate } = useSWRConfig();
  const layerPopupRefElement = useRef(null);
  const payLayerPopupRefElement = useRef(null);

  createLayerPopupRefElement(layerPopupRefElement);
  createPayLayerPopupRefElement(payLayerPopupRefElement);


  const ProgramList = dynamic(() => import('./program_list'), {
    ssr: false
  });
  const CustomSetPopup = dynamic(() => import('../../common/custom_set_popup'), {
    ssr: false
  });
  const UserProcessList = dynamic(() => import('./user_process_list_retask'), {
    ssr: false
  });
  const DetailLabelList = dynamic(() => import('./detail_label_list_retask'), {
    ssr: false
  });
  

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
  
  if( data == undefined ) {
    data = response;
  }

  let userinfo = {};
  userinfo.author = 'labler';
  data.layout = 'edit';
  data.video_position = 'right';
  data.EP_AIN = '1';
  data.PRG_AIN = '1';

  return (
    <SWRConfig value={{data}}>
      <main className={"flex flex-row px-6 py-6 h-[95vh]"}>
        {/* 왼쪽 프로그램 목록 */}
        <section className={"w-1/3 min-w-[340px] px-3 py-3 bg-whiteblue100"}>
          <div style={{'textAlign': 'center', 'height': '40px'}}>
            <span style={{'color': 'var(--theme-blue-color)', 'fontSize': '20px'}}>{response.userInfo.prtNm}</span>
            님 환영합니다.
            <br></br>
            해당화면은 재작업 화면 입니다.
          </div>
          {/* <ProgramList response={data?.prgList}></ProgramList> */}
        </section>
        
        {/* 오른쪽 */}
        <section className={"w-2/3 px-5"}>
          
          {/* 오른쪽 프로그램 진행 차트, 상세목록 */}
          <section className={"flex w-full h-[50vh] box-sizing-content"}>
            
            {/* 차트 */}
            <section className={"w-1/2 mr-4 bg-whiteblue100"}>
              {/* <PieChart></PieChart> */}
              <h1 style={{'fontSize':'3rem', 'textAlign':'center'}}>재작업 화면</h1>
            </section>
            {/* 차트 끝 */}
            
            {/* 상세목록 */}
            <section className={"w-1/2 ml-4 bg-whiteblue100"}>
              <DetailLabelList response={data?.epListJobCpl}></DetailLabelList>
            </section>
            {/* 상세목록 끝 */}

          </section>
          {/* 오른쪽 프로그램 진행 차트, 상세목록 끝 */}

          {/* 라벨 작업 중 목록 / 검수 작업 중 목록 */}
          <section className={"flex w-full mt-6 h-[35vh]"}>
            <UserProcessList response={data?.epListJobIng} user_id={response.userInfo.prtNm}></UserProcessList>
          </section>

          {/* 검수 반려 목록 / 재검수 요청 목록 */}
          {/* <section className={"flex w-full mt-6 h-[22.5vh-50px] border-y-1"}>
            <ConditionRejectList userinfo={userinfo} response={result.epListJobIng}></ConditionRejectList>
          </section> */}

        </section>
        {/* <section ref={layerPopupRefElement} id={"help_layer_popup"} className={styles.layer_popup} style={{ "display": "none", 'zIndex': '40' }}> */}
          {/* <CustomSetPopup response={data?.epListJobCpl} utilDate={utilDate}></CustomSetPopup> */}
        {/* </section> */}
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

  if(user_info.prtEml.indexOf('@datacrush.ai') == -1) {
    return {
      redirect: {
        permanent: false,
        destination: '/common/illegal'
      }
    }
  }

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
      param,
      response,
    } 
  }
}