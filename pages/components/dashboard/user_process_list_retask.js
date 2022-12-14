import { getCookie } from 'cookies-next';
import Link from 'next/link';

export default function UserProcessList({response, user_id}) {
    // const { data, error } = useSWR(PROCESS_API, fetcher, {response});
    
    // console.log('process ', response);
    // const [data, setData] = useState([{
    //     "epAin":1114,
    //     "epNm":"경제 드라마 동그라미 가족0012",
    //     "epVdoSnm":2,
    //     "filePath":"/M4.jpeg",
    //     "jobStat":"ING",
    //     "prgAin": 21,
    // }]);
    // if( response != undefined ) {
    //     response = data;
    // }
    
    // useEffect(() => {
    // }, [response])

    return (
        <div className={"container"}>
            <div className={"block relative w-full bg-blue-200 h-[27px] flex items-center justify-center"}>
                라벨 작업 중 목록
            </div>
            <div className={"flex flex-wrap -mx-1 lg:-mx-4 border-t-1 px-1"}>

            {/* <!-- Column --> */}
                <div className={"my-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 relative overflow-y-scroll h-[35vh]"}>
                    <article className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-[34px] sticky top-0 z-40 bg-white"}>
                        {/* <div className={"block relative w-1/3 h-[34px] flex items-center justify-center"}>
                            프로그램 목록
                        </div> */}
                        <div className={"block relative w-1/2 h-[34px] flex items-center justify-center"}>
                            프로그램 상세 목록
                        </div>
                        <div className={"block relative w-1/2 h-[34px] flex items-center justify-center"}>
                            시나리오 순번
                        </div>
                        {/* <div className={"block relative w-1/3 h-[34px] flex items-center justify-center"}>
                            작업
                        </div> */}
                    </article>
                    {/* <UserDetail response={response}></UserDetail> */}


                    {
                        response?.map((arr, idx) => {
                            if(arr.filePath == null || arr.filePath == undefined || arr.filePath.indexOf('https') != -1) {
                                arr.filePath = '/M4.jpeg';
                            }
                            return (
                                <article 
                                    id={arr.prgAin}
                                    key={`${arr.prgAin}_${arr.epAin}_${arr.epVdoSnm}`}
                                    className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 cursor-pointer"}
                                    onClick={(e) => {
                                        // console.log(e.target)
                                    }}
                                >

                                    <Link href={`/common/edit?epAin=${arr.epAin}&epVdoSnm=${arr.epVdoSnm}&prgAin=${arr.prgAin}&jobStat=${arr.jobStat}`}>
                                        <a target={"_blank"} className={"w-2/3 text-lg text-center no-underline hover:underline text-black opacity-75 text-blue-700"}>
                                            {arr.epNm}
                                        </a>
                                    </Link>
                        
                                    <div className={"block relative w-1/2 flex items-center justify-center no-click-event"}>
                                        {arr.epVdoSnm}
                                    </div>
                                </article>
                            )
                        })
                    }
                </div>
            {/* <!-- END Column --> */}

            </div>
        </div>
    )
}

