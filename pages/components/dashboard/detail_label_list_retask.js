import Link from "next/link";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDetailList } from '../../../store/nia_common/StoreDetailList';

const ProgramListDetail = ({response}) => {
    return (
        response?.map((arr, idx) => {
            if(arr.prtEml == undefined || arr.prtEml == '' || arr.prtEml == null ){ 
                return (
                    <article 
                        id={`${arr.prgAin}_${arr.epAin}_${arr.epVdoSnm}`}
                        key={`${arr.prgAin}_${arr.epAin}_${arr.epVdoSnm}`}
                        className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 cursor-pointer"}
                        onClick={(e) => {
                            // console.log(e.target)
                            // console.log(arr);
                        }}
                    >
                        {/* <header className={"flex flex-col w-1/3 items-center justify-between leading-tight p-1 md:p-4"}> */}
                            {/* <h1 className={"text-lg"}> */}
                                <Link href={`/common/edit?epAin=${arr.epAin}&epVdoSnm=${arr.epVdoSnm}&prgAin=${arr.prgAin}&jobStat=${arr.jobStat}`}>
                                    <a target={"_blank"} className={"w-2/3 text-lg text-center no-underline hover:underline text-black opacity-75 text-blue-700"}>
                                        {arr.epNm}
                                    </a>
                                </Link>
                            {/* </h1> */}
                        {/* </header>  */}
            
                        <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                            {arr.epVdoSnm}화
                        </div>
                        
                    </article>
                )
            }
        })
    )
}

export default function DetailLabelList({response}) {
    const detail_list = useSelector(getDetailList);
    useEffect(() => {

    }, [response, detail_list.epListPerPrg]);
    
    
    return (
        <div className={"flex flex-wrap -mx-1 lg:-mx-4 px-3 py-3"}>

        {/* <!-- Column --> */}
            <div className={"my-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 relative overflow-y-scroll h-[49vh-10px]"}>
                <article className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-[50px] sticky top-0 z-40 bg-white"}>
                    <div className={"block relative w-2/3 h-[50px] flex items-center justify-center"}>
                        프로그램
                        <br/>
                        상세 목록
                    </div>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        시나리오 순번
                    </div>
                </article>
                <ProgramListDetail response={response}></ProgramListDetail>
            </div>
        {/* <!-- END Column --> */}

        </div>
    )
}

