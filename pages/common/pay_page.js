import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from '../../styles/Layout.module.css'
import { getLayerPopupRefElement } from "../components/dashboard/dashboard";
import { getUtilDate, humanReadableTime, sendFetch } from "./common_script";
import _ from "lodash";
import { getCookie } from "cookies-next";

// let _position_x = 0;
// let _position_y = 0;
// let positionAction;

let total_complete_time = 0;

const RenderCompleteName = ({render_name_list}) => {
    return(
        <section style={{'position': 'sticky', 'overflow':'auto', 'height':'45vh', 'width':'50vw'}}>
            {
                render_name_list?.map((arr, idx) => {
                    return (
                        <ul key={idx} style={{ 'padding': '20px 30px' }}>
                            <div className={styles.layout_title_container} style={{'cursor': 'pointer'}}
                                onClick={(e) => {
                                    const target = e.target.nextElementSibling;
                                    if(target?.style?.display == 'none') {
                                        target.style.display = 'block';
                                    }
                                    else if(target || target?.style?.display == 'block'){
                                        target.style.display = 'none';
                                    }
                                }}>
                                <span>{arr.title}</span>
                                <div className={styles.complete_list_summary} style={{'width': '100%'}}>완료시간: {humanReadableTime(arr.totalTime)}</div>
                                <div className={styles.complete_list_summary} style={{'width': '100%'}}>완료갯수: {arr.itemlist.length}개</div>
                            </div>
                            <div className={styles.layout_title_container} style={{'display': 'none'}}>
                                <div className={styles.complete_list} style={{'width': '100%'}}>
                                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>이메일</div>  
                                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>프로그램 목록</div>  
                                    <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 시간</div>
                                    <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 완료시간</div>
                                </div>
                                {
                                    arr.itemlist?.map((item, item_idx) => {
                                        return (
                                            <div key={item_idx} style={{'width': '100%'}}>
                                                <div className={styles.complete_list}>
                                                    <div style={{'width': '100%'}}>{item.prtEml}</div>
                                                    <div style={{'width': '100%'}}>
                                                        <p>
                                                            {item.epNm}
                                                        </p>
                                                        <p>
                                                            {item.epVdoSnm}
                                                        </p>
                                                    </div>
                                                    <div style={{'width': '370px'}}>{humanReadableTime(item.playTime)}</div>
                                                    <div style={{'width': '370px'}}>
                                                        <p>
                                                            {item.complete_date}
                                                        </p>
                                                        <p>
                                                            {item.complete_time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </ul>
                    )
                })
            }
        </section>
    )
}

const RenderComplete = ({render_list}) => {
    return(
        <section style={{'position': 'sticky', 'overflow':'auto', 'height':'45vh', 'width':'50vw'}}>
            {
                render_list?.map((arr, idx) => {
                    // console.log(arr)
                    return (
                        <ul key={idx} style={{ 'padding': '20px 30px' }}>
                            <div className={styles.layout_title_container} style={{'cursor': 'pointer'}}
                                onClick={(e) => {
                                    const target = e.target.nextElementSibling;
                                    if(target?.style?.display == 'none') {
                                        target.style.display = 'block';
                                    }
                                    else if(target || target?.style?.display == 'block'){
                                        target.style.display = 'none';
                                    }
                                }}>
                                <span>{arr.title}</span>
                                <div className={styles.complete_list_summary} style={{'width': '100%'}}>완료시간: {humanReadableTime(arr.totalTime)}</div>
                                <div className={styles.complete_list_summary} style={{'width': '100%'}}>완료갯수: {arr.itemlist.length}개</div>
                            </div>
                            <div className={styles.layout_title_container} style={{'display': 'none'}}>
                            <div className={styles.complete_list}>
                                <div style={{'width': '30%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>이름</div>  
                                <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>이메일</div>  
                                <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>프로그램 목록</div>  
                                <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 시간</div>
                                <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 완료시간</div>
                            </div>
                            {
                                arr.itemlist?.map((item, item_idx) => {
                                    return (
                                        <div key={item_idx}>
                                            <div className={styles.complete_list}>
                                                <div style={{'width': '30%'}}>{item.prtNm}</div>
                                                <div style={{'width': '100%'}}>{item.prtEml}</div>
                                                <div style={{'width': '100%'}}>
                                                    <p>
                                                        {item.epNm}
                                                    </p>
                                                    <p>
                                                        {item.epVdoSnm}
                                                    </p>
                                                </div>
                                                <div style={{'width': '370px'}}>{humanReadableTime(item.playTime)}</div>
                                                <div style={{'width': '370px'}}>
                                                    <p>
                                                        {item.complete_date}
                                                    </p>
                                                    <p>
                                                        {item.complete_time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </ul>
                    )
                })
            }
        </section>
    )
}

const CompleteTask = ({list, summary, utilDate}) => {
    let jobLstEndDt = {};
    let jobLstEndMonth = {};
    let jobLstEndWeek = {};
    let jobPrtNm = {};
    let render_list = [];
    let render_name_list = [];
    let week_list = [];
    let month_list = [];
    let name_list = _.sortBy(list, ['prtNm']);

    list?.map((arr, idx) => {
        const complete_date = arr.jobLstEndDt.toString().split(' ');
        if(jobLstEndDt[complete_date[0]] == undefined) {
            jobLstEndDt[complete_date[0]] = [{'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]}];
        }
        else {
            jobLstEndDt[complete_date[0]].push({'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]});
        }
    });
    
    name_list?.map((arr, idx) => {
        const complete_date = arr.jobLstEndDt.toString().split(' ');
        const complete_name = `${arr.prtNm}(${arr.prtEml})`;
        if(jobPrtNm[complete_name] == undefined) {
            jobPrtNm[complete_name] = [{'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]}];
        }
        else {
            jobPrtNm[complete_name].push({'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]});
        }
    });


    for (const [key, value] of Object.entries(jobLstEndDt)) {
        let totalTime = 0;
        for( let idx in value ) {
            //총 시간
            totalTime += value[idx].playTime;
        }
        render_list.push({
            'title': key,
            'itemlist': value,
            totalTime,
        })
    }

    for (const [key, value] of Object.entries(jobPrtNm)) {
        let totalTime = 0;
        for( let idx in value ) {
            //총 시간
            totalTime += value[idx].playTime;
        }
        render_name_list.push({
            'title': key,
            'itemlist': value,
            totalTime,
        })
    }

    render_list.map((arr, idx) => {
        // if( isNaN(arr.totalTime) ) {
        if( isNaN(arr.totalTime) ) {
            arr.totalTime = 0;
        }
        if( parseInt(arr.totalTime) < 0 ) {
            arr.totalTime = Math.abs(arr.totalTime);
        }
        
        total_complete_time += arr.totalTime;
        
        if( parseInt(utilDate.firstday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.lastday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이번 달
            if( isNaN(jobLstEndMonth[`${utilDate.firstday}~${utilDate.lastday}`]) ) {
                jobLstEndMonth[`${(utilDate.firstday)}~${(utilDate.lastday)}`] = arr.totalTime;
                
            }
            else {
                jobLstEndMonth[`${(utilDate.firstday)}~${(utilDate.lastday)}`] = (jobLstEndMonth[`${utilDate.firstday}~${utilDate.lastday}`] + arr.totalTime);
            }
        }
        else if( parseInt(utilDate.lastmonth_firstday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.lastmonth_lastday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이전 달
            if( isNaN(jobLstEndMonth[`${utilDate.lastmonth_firstday}~${utilDate.lastmonth_lastday}`]) ) {
                jobLstEndMonth[`${(utilDate.lastmonth_firstday)}~${(utilDate.lastmonth_lastday)}`] = arr.totalTime;
                
            }
            else {
                jobLstEndMonth[`${(utilDate.lastmonth_firstday)}~${(utilDate.lastmonth_lastday)}`] = (jobLstEndMonth[`${utilDate.lastmonth_firstday}~${utilDate.lastmonth_lastday}`] + arr.totalTime);
            }
        }

        if( parseInt(utilDate.monday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.sunday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이번 주
            if( isNaN(jobLstEndWeek[`${utilDate.monday}~${utilDate.sunday}`]) ) {
                jobLstEndWeek[`${(utilDate.monday)}~${(utilDate.sunday)}`] = arr.totalTime;
            }
            else {
                jobLstEndWeek[`${(utilDate.monday)}~${(utilDate.sunday)}`] = (jobLstEndWeek[`${utilDate.monday}~${utilDate.sunday}`] + arr.totalTime);
            }
        }
        else if( parseInt(utilDate.lastmonday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.lastsunday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이전 주
            if( isNaN(jobLstEndWeek[`${utilDate.lastmonday}~${utilDate.lastsunday}`]) ) {
                jobLstEndWeek[`${utilDate.lastmonday}~${utilDate.lastsunday}`] = arr.totalTime;
            }
            else {
                jobLstEndWeek[`${utilDate.lastmonday}~${utilDate.lastsunday}`] = (jobLstEndWeek[`${utilDate.lastmonday}~${utilDate.lastsunday}`] + arr.totalTime);
            }
            
            
        }
    })

    for (const [key, value] of Object.entries(jobLstEndWeek)) {
        week_list.push({key, value});
    }
    for (const [key, value] of Object.entries(jobLstEndMonth)) {
        let spliter = key.replaceAll('-', '').split('~');
        if( spliter[0].includes('01') && spliter[1].includes('31') ) {
            month_list.push({key, value});
        }
    }
    
    // render_list.map((arr, idx) => {
    //     console.log(`영상 ${arr.title} => ${arr.totalTime}`)
    // })

    // summary.map((arr, idx) => {
    //     console.log(`자막 ${arr.yyyyMmDd} => ${arr.subHrMs}`)
    // })


    return(
        <>
            <div style={{'padding': '20px 30px'}}>
                <div className={styles.complete_list_summary} style={{'width': '100%'}}>모든 영상 작업 완료시간:{humanReadableTime(total_complete_time)}</div>
                <div style={{'display': 'flex', 'flexDirection': 'row', 'textAlign': 'center', 'border': '1px solid rgb(246 66 87 / 39%)', 'padding': '10px', 'flexWrap': 'wrap'}}>
                    {
                        summary?.map((arr, idx) => {
                            return(
                                <div key={idx} style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid rgb(246 66 87 / 39%)', 'padding': '10px', 'width': '100%', 'flex': '1 0 20%'}}>
                                    <span>{arr.yyyyMmDd}-{arr.jobPrrStts}</span>
                                    <div className={styles.complete_list_summary} style={{'width': '100%'}}>
                                        <p>자막(영상) 파일 수</p>
                                        <p>{arr.cntSub}</p>
                                    </div>
                                    <br></br>
                                    <div className={styles.complete_list_summary} style={{'width': '100%'}}>
                                        <p>자막 파일 내 문장 수</p>
                                        <p>{arr.cntSubSnt}</p>
                                    </div>
                                    <br></br>
                                    <div className={styles.complete_list_summary} style={{'width': '100%'}}>
                                        <p>자막 완료시간</p>
                                        <p>{humanReadableTime(arr.subHrMs)}</p>
                                    </div>
                                    <br></br>
                                    <div className={styles.complete_list_summary} style={{'width': '100%'}}>
                                        <p>앞뒤간격추가 자막 완료예상시간(20%증가)</p>
                                        <p>{humanReadableTime((arr.subHrMs)+(arr.subHrMs*0.2))}</p>
                                    </div>
                                    {/* <div className={styles.complete_list_summary} style={{'width': '100%'}}>예상 총 금액(시급3만원 기준):{(Math.ceil((month_item.value)/(60000))*500).toLocaleString('ko-kr')}원</div> */}
                                </div>
                            )
                        })
                    }
                </div>
                {/* <div className={styles.complete_list}>
                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>{utilDate?.lastmonth}~{utilDate?.month}월 완료목록</div>  
                </div> */}
                <article className={"flex flex-row"}>
                    <div className={styles.complete_list} style={{'width': '100%'}}>
                        <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>{utilDate?.lastmonth}~{utilDate?.month}월 완료목록
                        {
                            // month
                            month_list?.map((month_item, month_idx) => {
                                return(
                                    <div key={month_idx} style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid rgb(246 66 87 / 39%)', 'padding': '10px', 'width': '100%'}}>
                                        <span>{month_item.key} 일</span>
                                        <div className={styles.complete_list_summary} style={{'width': '100%'}}>영상 작업 완료시간:{humanReadableTime(month_item.value)}</div>
                                        <div className={styles.complete_list_summary} style={{'width': '100%'}}>예상 총 금액(시급3만원 기준):{(Math.ceil((month_item.value)/(60000))*500).toLocaleString('ko-kr')}원</div>
                                    </div>
                                )
                            })
                            
                        }
                        </div>  
                    </div>
                    <div className={styles.complete_list} style={{'width': '100%'}}>
                        <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>지난주~이번주 완료목록
                        {
                            // week
                            week_list?.map((week_item, week_idx) => {
                                return(
                                    <div key={week_idx} style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid #4268f663', 'padding': '10px', 'width': '100%'}}>
                                        <span>{week_item.key} 일</span>
                                        <div className={styles.complete_list_summary} style={{'width': '100%'}}>영상 작업 완료시간:{humanReadableTime(week_item.value)}</div>
                                    </div>
                                )
                            })
                        }
                        </div>  
                    </div>
                </article>
            </div>
            
            <article className={"flex flex-row"} style={{'height':'calc(90vh - 300px)'}}>
                <RenderComplete render_list={render_list}></RenderComplete>
                <RenderCompleteName render_name_list={render_name_list}></RenderCompleteName>
            </article>
            

        </>
    )
}

export default function PayPage() {
    const [response, setResponse] = useState([]);
    const [summary, setSummary] = useState([]);
    const utilDate = getUtilDate(new Date());
    // const helpContainerRefElement = useRef(null);

    const initFunction = useCallback(async() => {
        const EPLIST_COMPLETE = '/labeltool/getEpListForJobCpl';
        const SUMMARY_URL = '/labeltool/getSummary';
        const cookie = getCookie('tmp');
        if(cookie == undefined) {
          return {
            redirect: {
              permanent: false,
              destination: '/common/illegal'
            }
          }
        }
        const user_info = JSON.parse(cookie);
        const param = {
          "userInfo": {
              "prtEml": user_info.prtEml
          }
        };
        
        if( user_info.prtEml.includes('@datacrush.ai') ) {
            const complete = await sendFetch(EPLIST_COMPLETE, param, {method: 'POST'});
            const summary = await sendFetch(SUMMARY_URL, param, {method: 'POST'});
            setResponse(_.sortBy(complete?.epListJobCpl, ['jobLstEndDt']).reverse());
            setSummary(_.sortBy(summary?.summaryList, ['jobPrrSttScd']));
        }
    }, []);

    useEffect(() => {
        /*
        let first_position_move = true;
        if(_position_x != 0 && first_position_move) {
            helpContainerRefElement.current.scrollTop = _position_y;
            first_position_move = false;
        }
        
        const mousemoveEvent = (e) => {
            _position_x = e.offsetX;
            _position_y = e.offsetY;
        }
        positionAction = _.debounce(mousemoveEvent, 200);
        helpContainerRefElement.current.addEventListener('mousemove', (e) => positionAction(e));
        */
        initFunction();
    }, [initFunction]);
    
    return (
        <div className={styles.text_area}>
            <CompleteTask list={response} summary={summary} utilDate={utilDate}></CompleteTask>
            {/* <CompleteTask list={response} summary={[]} utilDate={utilDate}></CompleteTask> */}
        </div>
    )
}

export async function getServerSideProps(context) {
    const req = context.req;
    const res = context.res;
    const cookie = JSON.parse(getCookie('tmp', {req, res}));
    if(cookie == undefined) {
        //쿠키가 없을 경우
        return {
            redirect: {
                permanent: false,
                destination: '/common/illegal'
            }
        }
    }
    else if(!cookie.prtEml.includes('@datacrush.ai')) {
        //datacrush 직원이 아닐 경우
        return {
            redirect: {
                permanent: false,
                destination: '/common/illegal'
            }
        }
    }

    return { 
      props: { 
        // cookie
      } 
    }
  }