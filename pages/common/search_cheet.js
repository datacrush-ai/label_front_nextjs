import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { sendFetch } from "./common_script"
import NProgress from "nprogress";
// import "nprogress/nprogress.css";

export default function SearchCheet() {
    const [searchJSON, setSearchJSON] = useState([]);
    const prtAinRef = useRef(null);
    const bgnDtRef = useRef(null);
    const endDtRef = useRef(null);
    const textareaRef = useRef(null);
    let total_process_json = [];
    let render_info = [];

    const initFunction = useCallback(async() => {
        const param = {
            "prtAin": parseInt(prtAinRef.current.value),
            "bgnDt": parseInt(bgnDtRef.current.value),
            "endDt": parseInt(endDtRef.current.value),
            // "prtAin": 63,
            // "bgnDt": 20221101,
            // "endDt": 20221101
        }
        const result = await sendFetch('/labeltool/searchJson', param, {method: 'POST'});
        setSearchJSON(result.scenarioDTOList);
        NProgress.done();
        return result.scenarioDTOList;
    }, [prtAinRef, bgnDtRef, endDtRef]);
    
    useEffect(() => {
        
    }, [searchJSON]);
    
    let worker_consistency_list = [];

    searchJSON?.map((arr, idx) => {
        let worker_consistency = {};
        total_process_json[idx] = {
            '자막_전체_길이': searchJSON[idx]?.subtitleList.length,
        }
    
        arr?.subtitleList?.map((arr2, idx2) => {
            if(total_process_json[idx][arr2.subtileSelLabelInfo.speaker.labelNm] == undefined) {
                total_process_json[idx][arr2.subtileSelLabelInfo.speaker.labelNm] = 1;
            }
            else {
                total_process_json[idx][arr2.subtileSelLabelInfo.speaker.labelNm] += 1;
            }
            
            if( worker_consistency[arr2.subtileSelLabelInfo.speaker.labelNm] == undefined ) {
                worker_consistency[arr2.subtileSelLabelInfo.speaker.labelNm] = [];
            }
            else{
                worker_consistency[arr2.subtileSelLabelInfo.speaker.labelNm].push({
                    'sex': arr2.subtileSelLabelInfo.speakerSex.labelNm,
                    'age': arr2.subtileSelLabelInfo.speakerAge.labelNm,
                });
            }
        })

        worker_consistency_list.push(worker_consistency);

        total_process_json?.map((arr, idx) => {
            render_info[idx] = `[${idx}번] || `;
            for(let item in arr) {
                render_info[idx] += `[${item}] = [${arr[item]}] || `;
            }
        })
    })

    // console.log(worker_consistency_list)
    // console.log(worker_consistency_list[7])
    // console.log(worker_consistency_list[13])
    return(
        <>
            <div style={{'minWidth': '60%'}} className={"flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"}>
                <div className={"w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700"}>
                    <div className={"p-6 space-y-4 md:space-y-6 sm:p-8"}>
                        <input ref={prtAinRef} placeholder={"아이디(prtAin)"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <input ref={bgnDtRef} placeholder={"시작일자"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <input ref={endDtRef} placeholder={"종료일자"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <button onClick={() => {
                            NProgress.start();
                            initFunction();
                        }}
                                className={"w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"}
                        >찾기
                        </button>
                        <textarea style={{'width': '100%'}} ref={textareaRef}></textarea>
                    </div>
                </div>
            </div>
            <section style={{'display': 'flex', 'overflow': 'auto', 'flexDirection': 'column', 'height': '60vh', 'paddingLeft': '1.5rem', 'paddingRight': '1.5rem'}}>
                {
                    render_info?.map((arr, idx) => {
                        let render_info = arr.split('||');
                        if(arr.indexOf('[]') != -1 || arr.split("||").length <= 4) {
                            let work_result_info = `epAin=${searchJSON[idx].episodDTO.epAin} and epVdoSnm=${searchJSON[idx].episodDTO.epVdoSnm} and prgAin=${searchJSON[idx].episodDTO.prgAin}`;
                            if( arr.indexOf('[]') != -1 ) {
                                work_result_info += ` - 화자 없음`
                            }
                            if( arr.split("||").length <= 4 ) {
                                work_result_info += ` - 화자가 한개만 존재함`
                            }
                            // debugger;
                            //화자가 없을 경우 OR 화자가 한개일 경우
                            return(
                                <div key={idx} style={{'backgroundColor': 'red', 'marginBottom': '10px'}}>
                                    {
                                        render_info?.map((item, item_idx) => {
                                            let consistency_score = 0;
                                            let sex_list = {};
                                            if( item.indexOf('번') != -1 ) {
                                                item += work_result_info;
                                            }
                                            else {
                                                let speaker = item.split(' = ')[0].replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '');
                                                let before_sex = '';
                                                let before_age = '';
                                                worker_consistency_list[idx][speaker]?.map((consistency_item, consistency_item_idx) => {
                                                    if( (before_sex != '' || before_age != '') || (consistency_item.sex == '선택하세요' || consistency_item.age == '선택하세요')) {
                                                        //성별, 나이가 공백이 아닐 경우
                                                        
                                                        if( sex_list[consistency_item.sex] == undefined ) {
                                                            sex_list[consistency_item.sex] = 1;
                                                        }
                                                        else {
                                                            sex_list[consistency_item.sex] += 1;
                                                        }

                                                        if( sex_list[consistency_item.age] == undefined ) {
                                                            sex_list[consistency_item.age] = 1;
                                                        }
                                                        else {
                                                            sex_list[consistency_item.age] += 1;
                                                        }


                                                        if( before_sex != consistency_item.sex || before_age != consistency_item.age ) {
                                                            //성별이 바뀌었을 경우(일관성 X), 나이가 바뀌었을 경우(일관성 X)
                                                            consistency_score += 1
                                                        }

                                                    }
                                                    before_sex = consistency_item.sex;
                                                    before_age = consistency_item.age;
                                                })
                                            }
                                            if( consistency_score != 0 ) {
                                                // console.log(sex_list)
                                                //일관성 훼손
                                                return(
                                                    <div key={`${item}-${item_idx}`}  style={{'backgroundColor': '#ff7100', 'cursor': 'pointer'}}
                                                    onClick={
                                                        () => {
                                                            let target_error_speaker = JSON.stringify(worker_consistency_list[idx][item.split(' = ')[0].replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '')]);
                                                            textareaRef.current.value = target_error_speaker;
                                                            console.log(worker_consistency_list[idx])
                                                        }
                                                    }>
                                                        <span>{item}</span>
                                                        <span>
                                                            <br></br>
                                                            일관성 훼손 {consistency_score} &#61;&#62;  &#91;{JSON.stringify(sex_list).replaceAll('{', '').replaceAll('}', '')}&#93;
                                                        </span>
                                                        <br></br>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return(
                                                    <div key={`${item}-${item_idx}`}>
                                                        <span>{item}</span> 
                                                        <br></br>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        }

                        else {
                            //화자가 있을 경우
                            return(
                                <div key={idx} style={{'backgroundColor': 'var(--theme-blue-font)', 'marginBottom': '10px'}}>
                                    {
                                        render_info?.map((item, item_idx) => {
                                            let consistency_score = 0;
                                            let sex_list = {};
                                            let work_result_info = `epAin=${searchJSON[idx].episodDTO.epAin} and epVdoSnm=${searchJSON[idx].episodDTO.epVdoSnm} and prgAin=${searchJSON[idx].episodDTO.prgAin}`;
                                            if( item.indexOf('번') != -1 ) {
                                                item += work_result_info;
                                            }
                                            else {
                                                let speaker = item.split(' = ')[0].replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '');
                                                let before_sex = '';
                                                let before_age = '';
                                                worker_consistency_list[idx][speaker]?.map((consistency_item, consistency_item_idx) => {
                                                    if( (before_sex != '' || before_age != '') || (consistency_item.sex == '선택하세요' || consistency_item.age == '선택하세요')) {
                                                        //성별, 나이가 공백이 아닐 경우
                                                        
                                                        if( sex_list[consistency_item.sex] == undefined ) {
                                                            sex_list[consistency_item.sex] = 1;
                                                        }
                                                        else {
                                                            sex_list[consistency_item.sex] += 1;
                                                        }

                                                        if( sex_list[consistency_item.age] == undefined ) {
                                                            sex_list[consistency_item.age] = 1;
                                                        }
                                                        else {
                                                            sex_list[consistency_item.age] += 1;
                                                        }

                                                        if( before_sex != consistency_item.sex || before_age != consistency_item.age ) {
                                                            //성별이 바뀌었을 경우(일관성 X), 나이가 바뀌었을 경우(일관성 X)
                                                            consistency_score += 1
                                                        }
                                                    }
                                                    before_sex = consistency_item.sex;
                                                    before_age = consistency_item.age;
                                                })
                                            }
                                            if( consistency_score != 0 ) {
                                                //일관성 훼손
                                                // console.log(sex_list)
                                                return(
                                                    <div key={`${item}-${item_idx}`} style={{'backgroundColor': '#ff7100', 'cursor': 'pointer'}}
                                                    onClick={
                                                        () => {
                                                            let target_error_speaker = JSON.stringify(worker_consistency_list[idx][item.split(' = ')[0].replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '')]);
                                                            textareaRef.current.value = target_error_speaker;
                                                            console.log(worker_consistency_list[idx])
                                                        }
                                                    }>
                                                        <span>{item}</span>
                                                        <span>
                                                            <br></br>
                                                            일관성 훼손 {consistency_score} &#61;&#62;  &#91;{JSON.stringify(sex_list).replaceAll('{', '').replaceAll('}', '')}&#93;
                                                        </span>
                                                        <br></br>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return(
                                                    <div key={`${item}-${item_idx}`}>
                                                        <span>{item}</span> 
                                                        <br></br>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        }
                    })
                }
            </section>
        </>
    )
}

