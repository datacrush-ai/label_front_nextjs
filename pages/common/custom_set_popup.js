import React, { useEffect, useRef } from "react";
import styles from '../../styles/Layout.module.css'
import { getLayerPopupRefElement } from "../components/dashboard/dashboard";
import { humanReadableTime } from "./common_script";
// import styles from '../../styles/Home.module.css'

let _position_x = 0
let _position_y = 0
let positionAction;
// let total_complete_time = 0;

const RenderComplete = ({render_list}) => {
    return(
        <section id={'render_complete'} style={{'position': 'sticky', 'overflow':'auto', 'height':'45vh', 'width':'100vw'}}>
            {
                render_list?.map((arr, idx) => {
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
                            <div className={styles.layout_title_container} style={{'display': 'block'}}>
                                <div className={styles.complete_list}>
                                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>프로그램 목록</div>  
                                    <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 시간</div>
                                    <div style={{'width': '370px', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>작업 완료시간</div>
                                </div>
                                {
                                    arr.itemlist?.map((item, item_idx) => {
                                        return (
                                            <div key={item_idx}>
                                                <div className={styles.complete_list}>
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

const CompleteTask = ({list, utilDate, total_complete_time}) => {
    let jobLstEndDt = {};
    let jobLstEndMonth = {};
    let jobLstEndWeek = {};
    let render_list = [];
    let week_list = [];
    let month_list = [];

    list?.map((arr, idx) => {
        const complete_date = arr.jobLstEndDt.toString().split(' ');
        if(jobLstEndDt[complete_date[0]] == undefined) {
            jobLstEndDt[complete_date[0]] = [{'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]}];
        }
        else {
            jobLstEndDt[complete_date[0]].push({'epNm': `${arr.epNm}`, 'epVdoSnm': `[분할 번호]: ${arr.epVdoSnm}화`, 'playTime': Math.abs(arr.playTime), 'prtEml': arr.prtEml, 'prtNm': arr.prtNm, 'complete_date': complete_date[0], 'complete_time': complete_date[1]});
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
    
    return (
        <>
            <div style={{'padding': '20px 30px', 'height':'230px'}}>
                <div style={{'flexDirection': 'column', 'textAlign': 'center', 'border': '1px solid rgb(246 66 87 / 39%)', 'padding': '10px'}}>
                    <div className={styles.complete_list_summary} style={{'width': '100%'}}>모든 영상 작업 완료시간:{humanReadableTime(total_complete_time)}</div>
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
            </article>
            

        </>
    )

    /*
    return(
        <>
            <div style={{'padding': '20px 30px'}}>
                <div className={styles.complete_list}>
                    <div style={{'width': '100%', 'border': '1px solid', 'backgroundColor': 'antiquewhite'}}>{utilDate?.lastmonth}~{utilDate?.month}월 완료목록</div>  
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
    */
}

export default function CustomSetPopup({response, utilDate}) {
    const helpContainerRefElement = useRef(null);
    let total_complete_time = 0;
    useEffect(() => {
        const render_complete = document.getElementById('render_complete')
        let first_position_move = true;
        if(_position_x != 0 && first_position_move) {
            // console.log('이거한다~? ', _position_y)
            helpContainerRefElement.current.scrollTop = _position_y;
            first_position_move = false;
        }
        
        const mousemoveEvent = (e) => {
            _position_x = e.offsetX;
            _position_y = e.offsetY;
            // _position_y = e.offsetHeight;
            // _position_y = e.offsetTop;
            // _position_y = e.screenY;
        }

        positionAction = _.debounce(mousemoveEvent, 200);
        // helpContainerRefElement.current.addEventListener('mousemove', (e) => positionAction(e));
        render_complete.addEventListener('mousemove', (e) => positionAction(e));
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
                    <CompleteTask total_complete_time={total_complete_time} list={response} utilDate={utilDate}></CompleteTask>
                </div>
            </div>
            <div className={styles.dimmed}>
            </div>
        </>
    )
}