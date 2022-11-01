import React, { useEffect, useRef } from "react";
import styles from '../../styles/Layout.module.css'
import { getLayerPopupRefElement } from "../components/dashboard/dashboard";
import { humanReadableTime } from "./common_script";
// import styles from '../../styles/Home.module.css'

const CompleteTask = ({list, utilDate}) => {
    let jobLstEndDt = {};
    let jobLstEndMonth = {};
    let jobLstEndWeek = {};
    let render_list = [];
    let week_list = [];
    let month_list = [];

    list?.map((arr, idx) => {
        const complete_date = arr.jobLstEndDt.toString().split(' ')[0];
        if(jobLstEndDt[complete_date] == undefined) {
            jobLstEndDt[complete_date] = [{'epNm': `${arr.epNm}-${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime)}];
        }
        else {
            jobLstEndDt[complete_date].push({'epNm': `${arr.epNm}-${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime)});
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

    render_list.map((arr, idx) => {
        // if( isNaN(arr.totalTime) ) {
        if( isNaN(arr.totalTime) ) {
            arr.totalTime = 0;
        }
        if( parseInt(arr.totalTime) < 0 ) {
            arr.totalTime = Math.abs(arr.totalTime);
        }
        
        if( parseInt(utilDate.firstday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.lastday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이번 달
            if( isNaN(jobLstEndMonth[`${utilDate.firstday}~${utilDate.lastday}`]) ) {
                jobLstEndMonth[`${(utilDate.firstday)}~${(utilDate.lastday)}`] = arr.totalTime;
                
            }
            else {
                jobLstEndMonth[`${(utilDate.firstday)}~${(utilDate.lastday)}`] = (jobLstEndMonth[`${utilDate.firstday}~${utilDate.lastday}`] + arr.totalTime);
            }
        }

        if( parseInt(utilDate.monday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.sunday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //이번주
            if( isNaN(jobLstEndWeek[`${utilDate.monday}~${utilDate.sunday}`]) ) {
                jobLstEndWeek[`${(utilDate.monday)}~${(utilDate.sunday)}`] = arr.totalTime;
            }
            else {
                jobLstEndWeek[`${(utilDate.monday)}~${(utilDate.sunday)}`] = (jobLstEndWeek[`${utilDate.monday}~${utilDate.sunday}`] + arr.totalTime);
            }
        }
        else if( parseInt(utilDate.lastmonday.replaceAll('-', '')) <= parseInt(arr.title.replaceAll('-', '')) && parseInt(utilDate.lastsunday.replaceAll('-', '')) >= parseInt(arr.title.replaceAll('-', '')) ) {
            //저번 주
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
    
    return(
        <>
            <div style={{'padding': '20px 30px'}}>
                <div className={styles.complete_list}>
                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>{utilDate?.month}월 완료목록</div>  
                </div>
            {
                // month
                month_list?.map((month_item, month_idx) => {
                    return(
                        <div key={month_idx} style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid rgb(246 66 87 / 39%)', 'padding': '10px'}}>
                            <span>{month_item.key} 일</span>
                            <div className={styles.complete_list_summary} style={{'width': '100%'}}>총 완료시간:{humanReadableTime(month_item.value)}</div>
                        </div>
                    )
                })
            }
            </div>
            <div style={{'padding': '20px 30px'}}>
                <div className={styles.complete_list}>
                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>지난주~이번주 완료목록</div>  
                </div>
            {
                // week
                week_list?.map((week_item, week_idx) => {
                    return(
                        <div key={week_idx} style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid #4268f663', 'padding': '10px'}}>
                            <span>{week_item.key} 일</span>
                            <div className={styles.complete_list_summary} style={{'width': '100%'}}>총 완료시간:{humanReadableTime(week_item.value)}</div>
                        </div>
                    )
                })
            }
            </div>
            {
                render_list?.map((arr, idx) => {
                    return (
                        <ul key={idx} style={{ 'padding': '20px 30px' }}>
                            <div className={styles.layout_title_container}>
                                <span>{arr.title} 일</span>
                            </div>
                            {
                                <>
                                    <div className={styles.complete_list}>
                                        <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>프로그램 목록</div>  
                                        <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 시간</div>
                                    </div>
                                    {
                                        arr.itemlist?.map((item, item_idx) => {
                                            if((arr.itemlist.length-1) == item_idx){
                                                return (
                                                    <div key={item_idx}>
                                                        <div className={styles.complete_list}>
                                                            <div style={{'width': '100%'}}>{item.epNm}</div>
                                                            <div style={{'width': '100%'}}>{humanReadableTime(item.playTime)}</div>
                                                        </div>
                                                        <div className={styles.complete_list_summary} style={{'width': '100%'}}>총 완료시간:{humanReadableTime(arr.totalTime)}</div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div key={item_idx} className={styles.complete_list}>
                                                        <div style={{'width': '100%'}}>{item.epNm}</div>
                                                        <div style={{'width': '100%'}}>{humanReadableTime(item.playTime)}</div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </>
                            }
                        </ul>
                    )
                })
            }
        </>
    )
}

export default function CustomSetPopup({response, utilDate}) {
    const helpContainerRefElement = useRef(null);

    useEffect(() => {
    
    }, [response]);

    return (
        <>
            <div ref={helpContainerRefElement} className={styles.layer} style={{ "overflow": "auto" }}>
                
                <div className={styles.btn_area} style={{ "background": "#fff" }}>
                    <button onClick={(e) => { 
                        getLayerPopupRefElement().current.style.display = 'none';
                    }} className={styles.btn_close}
                        style={{
                            "border": "0", "color": "black", "backgroundColor": "#fff", "boxShadow": "0px 0px 0px 0px",
                            "position": "sticky", "top": "0", "padding": "20px 30px 10px 30px"
                        }}>CLOSE</button>
                </div>

                <div className={styles.text_area}>
                    <CompleteTask list={response} utilDate={utilDate}></CompleteTask>
                </div>
            </div>
            <div className={styles.dimmed}>
            </div>
        </>
    )
}