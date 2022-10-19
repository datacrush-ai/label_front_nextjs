export default function SearchBox() {
  
  return (
    <>
      <div className={"relative mt-6 mb-6"}>
        <input 
          type={"search"} 
          id={"input-group-1"} 
          className={"block p-2.5 w-full z-20 h-[34px] rounded p-4 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"} 
          placeholder={"검색어를 입력하세요."}>
        </input>
        <button 
          type={"submit"} 
          // style={{'backgroundColor':'--tw-bg-opacity: 1', 'backgroundColor': 'rgba(37, 99, 235 var(--tw-bg-opacity))'}} 
          className={"absolute top-0 right-0 p-2.5 h-[34px] rounded text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}>
          <svg aria-hidden={"true"} className={"w-5 h-5"} fill={"none"} stroke={"currentColor"} viewBox={"0 0 24 24"} xmlns={"http://www.w3.org/2000/svg"}>
            <path strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"2"} d={"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"}></path>
          </svg>
        </button>
        {/* <div className={"flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"}>
          <svg width={"20"} height={"20"} className={"DocSearch-Search-Icon"} viewBox={"0 0 20 20"}>
            <path d={"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"} stroke={"currentColor"} fill={"none"} fillRule={"evenodd"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
          </svg>
        </div> */}
      </div>
    </>
  )
}

