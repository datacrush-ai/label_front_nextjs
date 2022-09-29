import { Menu, Transition } from '@headlessui/react'
import { deleteCookie, getCookie } from 'cookies-next';
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getCue, saveServerCue } from '../../store/nia_layout/StoreCueSlice';
import { sendFetch, ToastMsg } from '../common/common_script';
// import { videoFullScreen, videoSplitScreen } from '../components/common/video_layout';
// import { getLayerPopupElement, getSubtitleInfo } from '../components/edits/edit';
// import { getCueFunc, lineCommentClick, lineReplaceClick } from '../components/edits/subtitle';
let episodDTO = null;
let scenarioLabelInfo = null;
let scenarioSelLabelInfo = null;
let subtitleLabelInfo = null;
let rst = null;
let userInfo = null;
let param = null;

export default function MenuItem() {
    const subtitleList = useSelector(getCue);
    useEffect(() => {
        episodDTO = JSON.parse(localStorage.getItem('episodDTO'));
        scenarioLabelInfo = JSON.parse(localStorage.getItem('scenarioLabelInfo'));
        scenarioSelLabelInfo = JSON.parse(localStorage.getItem('scenarioSelLabelInfo'));
        subtitleLabelInfo = JSON.parse(localStorage.getItem('subtitleLabelInfo'));
        rst = null;
        userInfo = JSON.parse(getCookie('tmp'));
        param = {
            episodDTO,
            scenarioLabelInfo,
            scenarioSelLabelInfo,
            subtitleLabelInfo,
            subtitleList,
            rst,
            userInfo,
        };
    }, [subtitleList]);
    
    

    return (

        <div className="text-right">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        Options
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        설정
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={(e) =>{
                                        deleteCookie('tmp');
                                        location.href = '/'
                                    }}
                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        로그아웃
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={async (e) => {
                                        // console.log(subtitleList)
                                        const context = '/labeltool/tmpSaveLabelJob';
                                        await sendFetch(context, param, {method:"POST"})
                                        .then(res => {
                                            ToastMsg('저장했습니다.', 3000, null, null, 'pass');
                                        });
                                    }}
                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        저장하기
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={async (e) => {
                                        if(confirm('최종 완료를 하시겠습니까?')){
                                            const context = '/labeltool/reqComplLabelJob';
                                            await sendFetch(context, param, {method:"POST"})
                                            .then(res => {
                                                ToastMsg('작업을 완료했습니다.\n잠시 후 창이 닫힙니다.', 2000, null, function() {
                                                    setTimeout(function() {
                                                        window.close();
                                                    },3000);
                                                }, 'pass');
    
                                            });
                                        }
                                    }}
                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        작업 완료
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}