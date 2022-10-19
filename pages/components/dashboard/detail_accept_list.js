import Link from 'next/link';

const ProgramListDetail = ({response}) => {
    // console.log(response)
    return (
        response?.map((arr, idx) => {
            {
                if(arr.filePath.indexOf('https') != -1) {
                    arr.filePath = '/M4.jpeg';
                }
            }
            return (
                <article 
                    id={arr.prgAin}
                    key={arr.prgAin}
                    className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 cursor-pointer"}
                    onClick={(e) => {
                        // console.log(e.target)
                    }}
                >
                    {/*                     
                    <header className={"flex flex-col w-1/3 items-center justify-between leading-tight p-1 md:p-4 no-click-event"}>
                        <h1 className={"text-lg no-click-event"}>
                            <a className={"no-underline hover:underline text-black opacity-75 text-blue-700 no-click-event"}>
                                {arr.epNm}
                            </a>
                        </h1>
                    </header> */}

                    {/* <header className={"flex flex-col w-1/3 items-center justify-between leading-tight p-1 md:p-4"}> */}
                        {/* <h1 className={"text-lg"}> */}
                        <Link href={`/common/edit?epAin=${arr.epAin}&epVdoSnm=${arr.epVdoSnm}&prgAin=${arr.prgAin}`}>
                            <a target={"_blank"} className={"text-lg text-center no-underline hover:underline text-black opacity-75 text-blue-700"}>
                                {arr.epNm}
                            </a>
                        </Link>
                        {/* </h1> */}
                    {/* </header>  */}
        
                    <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                        {idx.toString().padStart(3, 0)}
                    </div>
                    
                    <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                        검수 작업
                    </div>
                </article>
            )
        })
    )
}

export default function DetailAcceptList({response}) {
    return (
        <div className={"flex flex-wrap -mx-1 lg:-mx-4 px-3 py-3"}>

        {/* <!-- Column --> */}
            <div className={"my-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 relative overflow-y-scroll h-[49vh-10px]"}>
                <article className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-[50px] sticky top-0 z-40 bg-white"}>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        프로그램
                        <br/>
                        상세 목록
                    </div>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        시나리오 순번
                    </div>
                    <div className={"block relative w-1/3 h-[50px] flex items-center justify-center"}>
                        작업
                    </div>
                </article>
                <ProgramListDetail response={response}></ProgramListDetail>
            </div>
        {/* <!-- END Column --> */}

        </div>
    )
}

