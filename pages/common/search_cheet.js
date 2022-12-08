import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { sendFetch } from "./common_script"

export default function SearchCheet() {
    const [searchJSON, setSearchJSON] = useState([]);
    const prtAinRef = useRef(null);
    const bgnDtRef = useRef(null);
    const endDtRef = useRef(null);
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
        console.log(param);
        const result = await sendFetch('/labeltool/searchJson', param, {method: 'POST'});
        setSearchJSON(result.scenarioDTOList);
        return result.scenarioDTOList;
    }, [prtAinRef, bgnDtRef, endDtRef]);
    
    useEffect(() => {
        
    }, [searchJSON]);
    
    searchJSON?.map((arr, idx) => {
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
        })

        total_process_json?.map((arr, idx) => {
            render_info[idx] = `[${idx}번] || `;
            for(let item in arr) {
                render_info[idx] += `[${item}] = [${arr[item]}] || `;
            }
        })
    })

    console.log(searchJSON)
    
    return(
        <>
            <div style={{'minWidth': '60%'}} className={"flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"}>
                <div className={"w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700"}>
                    <div className={"p-6 space-y-4 md:space-y-6 sm:p-8"}>
                        <input ref={prtAinRef} placeholder={"아이디(prtAin)"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <input ref={bgnDtRef} placeholder={"시작일자"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <input ref={endDtRef} placeholder={"종료일자"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}></input>
                        <button onClick={() => initFunction()}
                                className={"w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"}
                        >찾기
                        </button>
                    </div>
                </div>
            </div>
            <section style={{'display': 'flex', 'overflow': 'auto', 'flexDirection': 'column', 'height': '60vh', 'paddingLeft': '1.5rem', 'paddingRight': '1.5rem'}}>
                {
                    render_info?.map((arr, idx) => {
                        let render_info = arr.split('||');
                        return(
                            render_info?.map((item, item_idx) => {
                                if( render_info.length == 4 ) {
                                    //비정상 확률높음
                                    return(
                                        <div key={`${arr}-${item_idx}`}>
                                            <div style={{'backgroundColor': 'red'}}>
                                                <span>{item}</span> 
                                                <br></br>
                                            </div>
                                        </div>
                                    )
                                } 
                                else {
                                    //정상 확률높음
                                    return(
                                        <div key={`${arr}-${item_idx}`}>
                                            <div  style={{'backgroundColor': 'var(--theme-blue-font)'}}>
                                                <span>{item}</span> 
                                                <br></br>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        )
                    })
                }
            </section>
        </>
    )
}

