import { Menu, Transition } from '@headlessui/react'
import { deleteCookie, setCookie } from 'cookies-next';
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getCue } from '../../store/nia_layout/StoreCueSlice';
import { sendFetch, sendSwitWebHook, ToastMsg } from '../common/common_script';
import { convertValueKey } from '../common/searchbox_autocomplete';
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
                                    <button className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        ??????
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                        onClick={async (e) => {
                                            window.open('/common/keyword_guide');
                                        }}
                                    >
                                        ????????? ?????????
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                        onClick={async (e) => {
                                            deleteCookie('speakerdependency');
                                            ToastMsg('?????? ???????????? ????????? ????????????.', 3000, null, null, 'pass');
                                        }}
                                    >
                                        ?????? ????????? ?????????
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
                                        ????????????
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={async (e) => {
                                        const speakerDependency = document.getElementById('speaker-dependency');
                                        let episodSpeakerDependencyValue = [];
                                        
                                        for(let depend_idx=0; depend_idx<21; depend_idx++) {
                                            //??????
                                            let memo = speakerDependency.children[depend_idx].children[0].children[0].value;
                                            //??????
                                            let speaker = speakerDependency.children[depend_idx].children[1].children[0].children[1].children[0].value;
                                            //????????? ??????
                                            let ageidx = speakerDependency.children[depend_idx].children[2].children[0].children[1].selectedIndex;
                                            let agecd = speakerDependency.children[depend_idx].children[2].children[0].children[1].children[ageidx].value;
                                            //??????
                                            let sexidx = speakerDependency.children[depend_idx].children[3].children[0].children[1].selectedIndex;
                                            let sexcd = speakerDependency.children[depend_idx].children[3].children[0].children[1].children[sexidx].value;
                                            episodSpeakerDependencyValue.push({ memo, speaker, ageidx, agecd, sexidx, sexcd });
                                        }
                                        setCookie('speakerdependency', JSON.stringify(episodSpeakerDependencyValue));

                                        let subtitle_edit_layout = document.querySelector('#subtitle_edit_layout').children[0];
                                        let subtitle_edit_layout_length = subtitle_edit_layout.childElementCount;
                                        for(let idx=0; idx<subtitle_edit_layout_length; idx++) {
                                            let target_subtitle_component = subtitle_edit_layout.children[idx].children[0].children[0];
                                            
                                            //????????? ?????? value
                                            let speaker_age_value = target_subtitle_component.children[3].children[1].selectedOptions[0].textContent;
                                            //????????? ?????? key
                                            let speaker_age_key = target_subtitle_component.children[3].children[1].selectedOptions[0].value;

                                            //?????? value
                                            let speaker_sex_value = target_subtitle_component.children[4].children[1].selectedOptions[0].textContent;
                                            //?????? key
                                            let speaker_sex_key = target_subtitle_component.children[4].children[1].selectedOptions[0].value;
                                            
                                            //????????? value
                                            let speaker_voc_value = target_subtitle_component.children[7].children[1].selectedOptions[0].textContent;
                                            //????????? key
                                            let speaker_voc_key = target_subtitle_component.children[7].children[1].selectedOptions[0].value;


                                            //?????? value
                                            let place_value = target_subtitle_component.children[5].children[1].children[0].value;
                                            //?????? key
                                            let place_key = convertValueKey(place_value);
                                            
                                            //?????? value
                                            let speaker_value = target_subtitle_component.children[6].children[1].children[0].value;
                                            //?????? key
                                            let speaker_key = convertValueKey(speaker_value);
                                            
                                            param.subtitleList[idx].subtileSelLabelInfo.placeType.labelCd = place_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.placeType.labelNm = place_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speaker.labelCd = speaker_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speaker.labelNm = speaker_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd = speaker_age_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelNm = speaker_age_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd = speaker_voc_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm = speaker_voc_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd = speaker_sex_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelNm = speaker_sex_value;
                                        }
                                        
                                        let context = '/labeltool/tmpSaveLabelJob';
                                        if(location.search.indexOf('jobStat=ERR') != -1 || location.search.indexOf('jobStat=ERR_ING') != -1) {
                                            context = '/labeltool/tmpSaveExceptionLabelJob';
                                        }
                                        setTimeout(async() => {
                                            if( param.subtitleList.length > 1 ) {
                                                await sendFetch(context, param, {method:"POST"})
                                                .then(res => {
                                                    ToastMsg('????????? ?????? ????????????.', 3000, null, null, 'pass');
                                                });
                                            }
                                            else {
                                                const hook_param = {
                                                    'text': `[???????????? ??????] - ???????????? ?????? ??????\n\n??????: ${param.userInfo.prtNm}\n?????????: ${param.userInfo.prtEml}\n????????????: epNm=${param.episodDTO.epNm}, prgAin=${param.episodDTO.prgAin}, epAin=${param.episodDTO.epAin}, epVdoSnm=${param.episodDTO.epVdoSnm}\n?????????_?????????_????????????: ${param.subtitleList.length}\n?????????_?????????_????????????: ${JSON.stringify(param.subtitleList)}`
                                                }
                                                sendSwitWebHook(hook_param);
                                                ToastMsg('???????????? ????????? ?????????????????????.\n????????? ?????? ??????????????? ??????????????? ???????????????.', 3000, null, null, 'warn');
                                            }
                                        }, 1000);
                                    }}
                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        ????????????
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={(e) => {
                                        const speakerDependency = document.getElementById('speaker-dependency');
                                        let episodSpeakerDependencyValue = [];
                                        
                                        for(let depend_idx=0; depend_idx<21; depend_idx++) {
                                            //??????
                                            let memo = speakerDependency.children[depend_idx].children[0].children[0].value;
                                            //??????
                                            let speaker = speakerDependency.children[depend_idx].children[1].children[0].children[1].children[0].value;
                                            //????????? ??????
                                            let ageidx = speakerDependency.children[depend_idx].children[2].children[0].children[1].selectedIndex;
                                            let agecd = speakerDependency.children[depend_idx].children[2].children[0].children[1].children[ageidx].value;
                                            //??????
                                            let sexidx = speakerDependency.children[depend_idx].children[3].children[0].children[1].selectedIndex;
                                            let sexcd = speakerDependency.children[depend_idx].children[3].children[0].children[1].children[sexidx].value;
                                            episodSpeakerDependencyValue.push({ memo, speaker, ageidx, agecd, sexidx, sexcd });
                                        }

                                        setCookie('speakerdependency', JSON.stringify(episodSpeakerDependencyValue));

                                        let subtitle_edit_layout = document.querySelector('#subtitle_edit_layout').children[0];
                                        let subtitle_edit_layout_length = subtitle_edit_layout.childElementCount;
                                        for(let idx=0; idx<subtitle_edit_layout_length; idx++) {
                                            let target_subtitle_component = subtitle_edit_layout.children[idx].children[0].children[0];
                                            
                                            //????????? ?????? value
                                            let speaker_age_value = target_subtitle_component.children[3].children[1].selectedOptions[0].textContent;
                                            //????????? ?????? key
                                            let speaker_age_key = target_subtitle_component.children[3].children[1].selectedOptions[0].value;

                                            //?????? value
                                            let speaker_sex_value = target_subtitle_component.children[4].children[1].selectedOptions[0].textContent;
                                            //?????? key
                                            let speaker_sex_key = target_subtitle_component.children[4].children[1].selectedOptions[0].value;
                                            
                                            //????????? value
                                            let speaker_voc_value = target_subtitle_component.children[7].children[1].selectedOptions[0].textContent;
                                            //????????? key
                                            let speaker_voc_key = target_subtitle_component.children[7].children[1].selectedOptions[0].value;


                                            //?????? value
                                            let place_value = target_subtitle_component.children[5].children[1].children[0].value;
                                            //?????? key
                                            let place_key = convertValueKey(place_value);
                                            
                                            //?????? value
                                            let speaker_value = target_subtitle_component.children[6].children[1].children[0].value;
                                            //?????? key
                                            let speaker_key = convertValueKey(speaker_value);
                                            
                                            param.subtitleList[idx].subtileSelLabelInfo.placeType.labelCd = place_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.placeType.labelNm = place_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speaker.labelCd = speaker_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speaker.labelNm = speaker_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd = speaker_age_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerAge.labelNm = speaker_age_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd = speaker_voc_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm = speaker_voc_value;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd = speaker_sex_key;
                                            param.subtitleList[idx].subtileSelLabelInfo.speakerSex.labelNm = speaker_sex_value;
                                        }
                                        
                                        //console.log(param.subtitleList);

                                        // const context = '/labeltool/tmpSaveLabelJob';
                                        let context = '/labeltool/tmpSaveLabelJob';
                                        if(location.search.indexOf('jobStat=ERR') != -1 || location.search.indexOf('jobStat=ERR_ING') != -1) {
                                            context = '/labeltool/tmpSaveExceptionLabelJob';
                                        }
                                        setTimeout(async() => {
                                            if( param.subtitleList.length > 1 ) {
                                                await sendFetch(context, param, {method:"POST"})
                                                .then(res => {
                                                    ToastMsg('????????? ?????? ????????????.', 3000, null, null, 'pass');
                                                });
                                            }
                                            else {
                                                const hook_param = {
                                                    'text': `[?????? ?????? ??????, ????????????] - ???????????? ?????? ??????\n\n??????: ${param.userInfo.prtNm}\n?????????: ${param.userInfo.prtEml}\n????????????: epNm=${param.episodDTO.epNm}, prgAin=${param.episodDTO.prgAin}, epAin=${param.episodDTO.epAin}, epVdoSnm=${param.episodDTO.epVdoSnm}\n?????????_?????????_????????????: ${param.subtitleList.length}\n?????????_?????????_????????????: ${JSON.stringify(param.subtitleList)}`
                                                }
                                                sendSwitWebHook(hook_param);
                                                ToastMsg('???????????? ????????? ?????????????????????.\n????????? ?????? ??????????????? ??????????????? ???????????????.', 3000, null, null, 'warn');
                                            }
                                        }, 1000);

                                        
                                        setTimeout(async() => {

                                            let unable_save_idx = [];
                                            let unable_save_list = [];
                                            // console.log(param.scenarioSelLabelInfo.category)
                                            // console.log(param.scenarioSelLabelInfo.conversationSpeakers)
    
                                            for(let idx=0; idx<subtitleList.length; idx++) {
    
                                                if( subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd == "LBL_KND_00_000" ) {
                                                    subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelCd = "LBL_KND_24_001";
                                                    subtitleList[idx].subtileSelLabelInfo.speakerOvrVoc.labelNm = "??????";
                                                }
    
                                                if(  
                                                    (subtitleList[idx].subtileSelLabelInfo.placeType.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.placeType.labelCd == '' || subtitleList[idx].subtileSelLabelInfo.placeType.labelNm == '') ||
                                                    (subtitleList[idx].subtileSelLabelInfo.speaker.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.speaker.labelCd == '' ||  subtitleList[idx].subtileSelLabelInfo.speaker.labelNm == '') ||
                                                    (subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd == 'LBL_KND_00_000' ||  subtitleList[idx].subtileSelLabelInfo.speakerAge.labelCd == '' ||  subtitleList[idx].subtileSelLabelInfo.speakerAge.labelNm == '') ||
                                                    (subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd == 'LBL_KND_00_000' || subtitleList[idx].subtileSelLabelInfo.speakerSex.labelCd == '' ||  subtitleList[idx].subtileSelLabelInfo.speakerSex.labelNm == '')
                                                ) {
                                                    unable_save_list.push(subtitleList[idx]);
                                                    unable_save_idx.push((parseInt(subtitleList[idx].subSnm)+ 1) + '?????? ');
                                                }
                                            }
    
                                            if(param.scenarioSelLabelInfo.category.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.category.labelCd == '' || param.scenarioSelLabelInfo.category.labelCd == 'LBL_KND_23_999' || param.scenarioSelLabelInfo.category.labelNm == '???????????????') {
                                                unable_save_list.push('???????????? ');
                                                unable_save_idx.push('1 ???????????? ');
                                            }
                                            if(param.scenarioSelLabelInfo.subCategory.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.subCategory.labelCd == '' || param.scenarioSelLabelInfo.subCategory.labelNm == '') {
                                                unable_save_list.push('?????? ????????????');
                                                unable_save_idx.push('2 ?????? ????????????');
                                            }
                                            if(param.scenarioSelLabelInfo.keyword.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.keyword.labelCd == '' || param.scenarioSelLabelInfo.keyword.labelNm == '') {
                                                unable_save_list.push('?????? ?????? ?????????');
                                                unable_save_idx.push('3 ?????? ?????? ?????????');
                                            }
                                            if(param.scenarioSelLabelInfo.conversationSpeakers.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.conversationSpeakers.labelCd == '' || param.scenarioSelLabelInfo.conversationSpeakers.labelCd == 'LBL_KND_23_999' || param.scenarioSelLabelInfo.conversationSpeakers.labelNm == '???????????????') {
                                                unable_save_list.push('?????? ??????');
                                                unable_save_idx.push('4 ?????? ??????');
                                            }
                                            if(param.scenarioSelLabelInfo.opinion.labelCd == 'LBL_KND_00_000' || param.scenarioSelLabelInfo.opinion.labelCd == '' || param.scenarioSelLabelInfo.opinion.labelNm == '') {
                                                unable_save_list.push('??????');
                                                unable_save_idx.push('5 ??????');
                                            }
    
    
                                            if( unable_save_list.length > 0 ) {
                                                ToastMsg(`???????????? ???????????????.\n??????: ???????????? ?????? ????????? ???????????????.\n${unable_save_idx}`, 10000, function() {
                                                    let subtitle_edit_layout = document.querySelector('#subtitle_edit_layout');
                                                    let line = parseInt(unable_save_idx[0]) - 1;
                                                    subtitle_edit_layout.scrollTop = 120 * line;
                                                }, null, 'warn');
                                                
                                            }
                                            else {
                                                if(confirm('?????? ????????? ???????????????????')){
                                                    let context = '/labeltool/reqComplLabelJob';
                                                    if(location.search.indexOf('jobStat=ERR') != -1 || location.search.indexOf('jobStat=ERR_ING') != -1) {
                                                        context = '/labeltool/reqComplExceptionLabelJob';
                                                    }
                                                    
                                                    if( param.subtitleList.length > 1 ) {
                                                        // console.log(param)
                                                        await sendFetch(context, param, {method:"POST"})
                                                        .then(res => {
                                                            ToastMsg('????????? ??????????????????.\n?????? ??? ?????? ????????????.', 2000, null, function() {
                                                                setTimeout(function() {
                                                                    window.close();
                                                                },3000);
                                                            }, 'pass');
                                                        });
                                                    }
                                                    else {
                                                        const hook_param = {
                                                            'text': `[?????? ?????? ??????, ????????????] - ???????????? ?????? ??????\n\n??????: ${param.userInfo.prtNm}\n?????????: ${param.userInfo.prtEml}\n????????????: epNm=${param.episodDTO.epNm}, prgAin=${param.episodDTO.prgAin}, epAin=${param.episodDTO.epAin}, epVdoSnm=${param.episodDTO.epVdoSnm}\n?????????_?????????_????????????: ${param.subtitleList.length}\n?????????_?????????_????????????: ${JSON.stringify(param.subtitleList)}`
                                                        }
                                                        sendSwitWebHook(hook_param);
                                                        ToastMsg('???????????? ????????? ?????????????????????.\n????????? ?????? ??????????????? ??????????????? ???????????????.', 3000, null, null, 'warn');
                                                    }
                                                }
                                            }
                                        }, 3000);
                                    }}
                                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        ?????? ??????
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