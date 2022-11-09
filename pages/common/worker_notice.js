import { getCookie } from "cookies-next";
import { useEffect, useRef } from "react";
import styles from '../../styles/Layout.module.css'
import { sendFetch, ToastMsg } from "./common_script";

export default function WorkerNotice({user_info, alarm_list}) {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const bgnRef = useRef(null);
    const endRef = useRef(null);

    console.log(alarm_list)

    const timestamp = (now) => {
        let time = new Date(now);
        time.setHours(time.getHours() + 9);
        return time.toISOString().replace('T', ' ').substring(0, 19);
    }
    const addNotice = async() => {
        
        if( (titleRef.current.value != '' || contentRef.current.value != '') && (bgnRef.current.value != '' && endRef.current.value != '') ) {
            let bgntime = timestamp(bgnRef.current.value);
            let endtime = timestamp(endRef.current.value);
            const NOTICE_URL = '/labeltool/addNotice';
            let param = {
                'userInfo': {
                    'prtEml': user_info.prtEml
                },
                'notice': {
                    'ntcTtl': titleRef.current.value,
                    'ntcCn': contentRef.current.value,
                    'ntcImgUrl': "/consult_large_yellow_pc.png",
                    'ntcVldBgnDt': bgntime,
                    'ntcVldEndDt': endtime,
                }
            };
            await sendFetch(NOTICE_URL, param, {method: 'POST'});
            ToastMsg('알람이 등록되었습니다.', 3000, null, null, 'pass');
            titleRef.current.value = '';
            contentRef.current.value = '';
        }
        else {
            ToastMsg('알람이 등록되려면 제목이나 내용, 시작시간 종료시간을 입력해야 합니다.', 3000, null, null, 'warn');
        }
    }
    useEffect(() => {
        // console.log(titleRef.current.value)
        // console.log(contentRef.current.value)
    }, [user_info.prtEml, alarm_list])
    
    
    return(
        <>
            <div className={styles.subtitle_container} style={{'display': 'flex', 'flexDirection': 'column'}}>
                <div className={"flex justify-center items-center flex flex-col"}>
                    <input ref={titleRef} style={{'border': '1px dotted', 'marginTop': '10px'}} className={styles.subtitle_board} placeholder={"제목을 입력하세요"}></input>
                    <textarea ref={contentRef} style={{'border': '1px dotted', 'marginTop': '10px'}} className={styles.subtitle_board} placeholder={"내용을 입력하세요"}></textarea>
                    <p>시작시간</p><input ref={bgnRef} style={{'height': '5rem'}} type={"datetime-local"}/>
                    <br></br>
                    <br></br>
                    <p>종료시간</p><input ref={endRef} style={{'height': '5rem'}} type={"datetime-local"}/>
                    <input style={{'border': '1px dotted', 'marginTop': '10px'}} className={styles.subtitle_board} placeholder={"이미지 URL을 입력하세요"} defaultValue={"/consult_large_yellow_pc.png"}></input>
                </div>
                <button type={"submit"} className={"right-0 p-2.5 h-[34px] rounded text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}
                onClick={addNotice}>
                    공지사항 등록
                </button>
            </div>

            {/* {
                alarm_list?.map((arr, idx) => {
                    <div key={idx} className={styles.subtitle_container} style={{'display': 'flex', 'flexDirection': 'column'}}>
                        <div className={"flex justify-center items-center flex flex-col"}>
                            <span>{arr.ntcTtl}</span>
                            <span>{arr.ntcCn}</span>
                            <span>시작시간: {arr.ntcVldBgnDt}</span>
                            <span>종료시간: {arr.ntcVldEndDt}</span>
                            <span>이미지: {arr.ntcImgUrl}</span>
                            <span>사용여부: {arr.ntcUseYn}</span>
                        </div>
                    </div>
                })
            } */}
        </>
    )
}

export async function getServerSideProps(context) {
    const req = context.req;
    const res = context.res;
    const cookie = getCookie('tmp', {req, res});
    const user_info = JSON.parse(cookie);
    if(cookie == undefined) {
      return {
        redirect: {
          permanent: false,
          destination: '/common/illegal'
        }
      }
    }
    if(user_info.prtEml.toString().includes('@datacrush.ai') == false) {
      return {
        redirect: {
          permanent: false,
          destination: '/common/illegal'
        }
      }
    }

    const ALARM_LIST_URL = '/labeltool/getNoticeList';
    const param = {
        'userInfo': {
            'prtEml': user_info?.['prtEml']
        }
    };
    // const alarm_list = await sendFetch(ALARM_LIST_URL, param, {method: 'POST'});

    return { 
      props: { 
        user_info,
        // 'alarm_list': alarm_list.notice,
      } 
    }
  }