export default function Illegal() {
    return(
        <div className={"flex justify-center items-center"}>
            최대 동시 작업 갯수에 도달했습니다.
            <br></br>
            작업 중인 목록을 먼저 완료해야 합니다.
        </div>
    )
}