import { Menu, Transition } from '@headlessui/react'
import { deleteCookie } from 'cookies-next';
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getCue } from '../../store/nia_layout/StoreCueSlice';
import { sendFetch, ToastMsg } from '../common/common_script';
import { getTmpJSON } from '../common/video_layout';

export default function MenuItem() {
    const subtitleList = useSelector(getCue);
    let param = getTmpJSON();
    useEffect(() => {
        param.subtitleList = subtitleList;
    }, [subtitleList, param]);
    
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
                                            ToastMsg('작업을 저장 했습니다.', 3000, null, null, 'pass');
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
                                        let unable_save_idx = [];
                                        let unable_save_list = [];

                                        for(let idx=0; idx<subtitleList.length; idx++) {
                                            console.log(subtitleList[idx].subtileSelLabelInfo.speaker.labelCd)
                                            if(  
                                                (subtitleList[idx].subtileSelLabelInfo.placeType.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.placeType.labelCd == '') ||
                                                (subtitleList[idx].subtileSelLabelInfo.speaker.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.speaker.labelCd == '' || subtitleList[idx].subtileSelLabelInfo.speaker.labelCd == 'LBL_KND_23_999') ||
                                                (subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd == '') ||
                                                (subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd == 'LBL_KND_00_000' || subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd == '')
                                            ) {
                                                unable_save_list.push(subtitleList[idx]);
                                                unable_save_idx.push((parseInt(subtitleList[idx].subSnm)+ 1) + '라인 ');
                                            }
                                        }

                                        

                                        if(param.scenarioSelLabelInfo.category.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.category.labelCd == '' || param.scenarioSelLabelInfo.category.labelCd == 'LBL_KND_23_999') {
                                            unable_save_list.push('카테고리 ');
                                            unable_save_idx.push('1 카테고리 ');
                                        }
                                        if(param.scenarioSelLabelInfo.subCategory.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.subCategory.labelCd == '') {
                                            unable_save_list.push('하위 카테고리');
                                            unable_save_idx.push('2 하위 카테고리');
                                        }
                                        if(param.scenarioSelLabelInfo.keyword.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.keyword.labelCd == '') {
                                            unable_save_list.push('대화 주제 키워드');
                                            unable_save_idx.push('3 대화 주제 키워드');
                                        }
                                        if(param.scenarioSelLabelInfo.conversationSpeakers.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.conversationSpeakers.labelCd == '' || param.scenarioSelLabelInfo.conversationSpeakers.labelCd == 'LBL_KND_23_999') {
                                            unable_save_list.push('대화 주체');
                                            unable_save_idx.push('4 대화 주체');
                                        }
                                        if(param.scenarioSelLabelInfo.opinion.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.opinion.labelCd == '') {
                                            unable_save_list.push('평판');
                                            unable_save_idx.push('5 평판');
                                        }


                                        if( unable_save_list.length > 0 ) {
                                            ToastMsg(`저장하지 못했습니다.\n사유: 선택하지 않은 라벨이 존재합니다.\n${unable_save_idx}`, 10000, function() {
                                                let line = parseInt(unable_save_idx[0]) - 1;
                                                subtitle_edit_layout.scrollTop = 120 * line;
                                            }, null, 'warn');
                                            
                                        }
                                        else {
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