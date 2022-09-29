import styles from '../../../styles/Home.module.css'
import Image from 'next/image';

const UserRejectDetail = ({response}) => {
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
                    <header className={"flex flex-col w-1/3 items-center justify-between leading-tight p-1 md:p-4 no-click-event"}>
                        <h1 className={"text-lg no-click-event"}>
                            <a className={"no-underline hover:underline text-black opacity-75 text-blue-700 no-click-event"}>
                                {arr.epNm}
                            </a>
                        </h1>
                    </header>
        
                    <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                        비밀은 없어
                    </div>
                    
                    <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                        {idx.toString().padStart(3, 0)}
                    </div>
                    <div className={"block relative w-1/3 flex items-center justify-center no-click-event"}>
                        라벨 재작업
                    </div>
                </article>
            )
        })
    )
}

export default function UserRejectList({response}) {
    return (
        <div className={"container"}>
            <div className={"block relative w-full bg-whitered330  h-[27px] flex items-center justify-center"}>
                검수 반려 목록
            </div>
            <div className={"flex flex-wrap -mx-1 lg:-mx-4 border-t-1 px-1"}>

            {/* <!-- Column --> */}
                <div className={"my-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 relative overflow-y-scroll h-[17.5vh-50px]"}>
                    <article className={"overflow-hidden rounded-lg shadow-lg block flex flex-wrap -mx-1 lg:-mx-4 h-[34px] sticky top-0 z-40 bg-white"}>
                        <div className={"block relative w-1/4 h-[34px] flex items-center justify-center"}>
                            프로그램 목록
                        </div>
                        <div className={"block relative w-1/4 h-[34px] flex items-center justify-center"}>
                            프로그램 상세 목록
                        </div>
                        <div className={"block relative w-1/4 h-[34px] flex items-center justify-center"}>
                            시나리오 순번
                        </div>
                        <div className={"block relative w-1/4 h-[34px] flex items-center justify-center"}>
                            작업
                        </div>
                    </article>
                    <UserRejectDetail response={response}></UserRejectDetail>
                </div>
            {/* <!-- END Column --> */}

            </div>
        </div>
    )
}

