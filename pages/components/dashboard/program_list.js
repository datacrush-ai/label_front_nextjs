import Image from 'next/image';
import { setProcessDetail } from '../../../store/nia_common/StoreProcessDetail';
import { useDispatch } from 'react-redux';
import { sendFetch } from '../../common/common_script';
import { getCookie } from 'cookies-next';

const _user_info = undefined;
const _arr = undefined;
const _e = undefined;
const _dispatchEvent = undefined;

export const re_process_click = async() => {
    if( _user_info != undefined ) {
        return process_click(_user_info, _arr, _e, _dispatchEvent);
    }
}

const process_click = async(user_info, arr, e, dispatchEvent) => {
    _user_info = user_info;
    _arr = arr;
    _e = e;
    _dispatchEvent = dispatchEvent;

    const param = {
        "userInfo": {
            "prtEml": JSON.parse(user_info)?.prtEml
        },
        "prg": {
            "prgAin": arr.prgAin
        }
    };
    const url = '/labeltool/getJobStatForDashboard';
    const options = {
        'method': 'POST'
    }
    const res = await sendFetch(url, param, options);
    
    let process_detail = {
        "prg_ain": e.target.id,
        "process_name": e.target.children[0].children[1].textContent,
        "process_list": res.jobStatList
    };
    
    dispatchEvent(setProcessDetail(process_detail));
}

const ProgramListDetail = ({response}) => {
    const user_info = getCookie('tmp');
    const dispatch = useDispatch();
    return (
        response?.map((arr, idx) => {
            {
                if(arr.fleNm == null || arr.fleNm == undefined || arr.fleNm.indexOf('https') != -1) {
                    arr.fleNm = '/datacrush-logo.png';
                }
            }
            return (
                <article 
                    id={arr.prgAin}
                    key={`${arr.prgAin}_${arr.epAin}_${arr.epVdoSnm}`}
                    className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-32 cursor-pointer"}
                    onClick={async(e) => {
                        process_click(user_info, arr, e, dispatch);
                        /*
                        const param = {
                            "userInfo": {
                                "prtEml": JSON.parse(user_info)?.prtEml
                                // "prtEml": "raelee@datacrush.ai"
                            },
                            "prg": {
                                "prgAin": arr.prgAin
                            }
                        };
                        const url = '/labeltool/getJobStatForDashboard';
                        const options = {
                            'method': 'POST'
                        }
                        const res = await sendFetch(url, param, options);
                        
                        let process_detail = {
                            "prg_ain": e.target.id,
                            "process_name": e.target.children[0].children[1].textContent,
                            "process_list": res.jobStatList
                        };
                        dispatch(setProcessDetail(process_detail));
                        */
                        
                    }}
                >
                    <header className={"flex flex-col items-center justify-between leading-tight p-2 md:p-4 w-1/3 no-click-event"}>
                        <div className={"block relative w-full h-32 no-click-event"}>
                            <Image 
                                alt={"Placeholder"} 
                                className={"block h-auto w-full no-click-event"} 
                                src={arr.fleNm} 
                                layout={"fill"} 
                                objectFit={"contain"} 
                                priority={true}>
                            </Image>
                        </div>
                        <h1 className={"text-lg no-click-event"}>
                            <a className={"no-underline hover:underline text-violet-400 no-click-event"}>
                                {arr.prgNm}
                            </a>
                        </h1>
                    </header>
        
                    <div className={"block relative w-1/3 h-32 flex items-center justify-center no-click-event"}>
                        {arr.readyLb}%
                    </div>
                    
                    <div className={"block relative w-1/3 h-32 flex items-center justify-center no-click-event"}>
                        {arr.labelCp}%
                    </div>
                </article>
            )
        })
    )
}

export default function ProgramList({response}) {
    // const user_info = getCookie('tmp');
    // const dispatch = useDispatch();

    
    // useEffect(() => {

    // }, [response])


    return (
        <div className={"flex flex-wrap -mx-1 lg:-mx-4 px-1"}>

        {/* <!-- Column --> */}
            <div className={"my-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 relative h-[95vh-150px] overflow-auto"}>
                <article className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-[50px] sticky top-0 z-40 bg-white"}>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        프로그램 목록
                    </div>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        라벨 준비 작업
                    </div>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        라벨 작업 완료
                    </div>
                </article>
                <ProgramListDetail response={response}></ProgramListDetail>

                {/* {
                    response?.map((arr, idx) => {
                        {
                            if(arr.fleNm == null || arr.fleNm == undefined || arr.fleNm.indexOf('https') != -1) {
                                arr.fleNm = '/datacrush-logo.png';
                            }
                        }
                        return (
                            <article 
                                id={arr.prgAin}
                                key={`${arr.prgAin}_${arr.epAin}_${arr.epVdoSnm}`}
                                className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-32 cursor-pointer"}
                                onClick={async(e) => {
                                    const param = {
                                        "userInfo": {
                                            "prtEml": JSON.parse(user_info)?.prtEml
                                            // "prtEml": "raelee@datacrush.ai"
                                        },
                                        "prg": {
                                            "prgAin": arr.prgAin
                                        }
                                    };
                                    const url = '/labeltool/getJobStatForDashboard';
                                    const options = {
                                        'method': 'POST'
                                    }
                                    const res = await sendFetch(url, param, options);
                                    
                                    let process_detail = {
                                        "prg_ain": e.target.id,
                                        "process_name": e.target.children[0].children[1].textContent,
                                        "process_list": res.jobStatList
                                    };
                                    dispatch(setProcessDetail(process_detail));
                                }}
                            >
                                <header className={"flex flex-col items-center justify-between leading-tight p-2 md:p-4 w-1/3 no-click-event"}>
                                    <div className={"block relative w-full h-32 no-click-event"}>
                                        <Image 
                                            alt={"Placeholder"} 
                                            className={"block h-auto w-full no-click-event"} 
                                            src={arr.fleNm} 
                                            layout={"fill"} 
                                            objectFit={"contain"} 
                                            priority={true}>
                                        </Image>
                                    </div>
                                    <h1 className={"text-lg no-click-event"}>
                                        <a className={"no-underline hover:underline text-violet-400 no-click-event"}>
                                            {arr.prgNm}
                                        </a>
                                    </h1>
                                </header>
                    
                                <div className={"block relative w-1/3 h-32 flex items-center justify-center no-click-event"}>
                                    {arr.readyLb}%
                                </div>
                                
                                <div className={"block relative w-1/3 h-32 flex items-center justify-center no-click-event"}>
                                    {arr.labelCp}%
                                </div>
                            </article>
                        )
                    })
                } */}
            </div>
        {/* <!-- END Column --> */}

        </div>
    )
}

