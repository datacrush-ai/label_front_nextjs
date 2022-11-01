import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../styles/Layout.module.css';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import { getCueFunc } from './subtitle';
import { createTmpJSON, getTmpJSON } from './video_layout';

let _map = {};
let saveAction;

const createKeyValueSet = (dataList) => {
    for(let idx=0; idx<dataList?.itemlist?.length; idx++) {
        let key = dataList.itemlist[idx]?.labelNm;
        let value = dataList.itemlist[idx]?.labelCd;
        _map[key] = value;
    }
    return _map;
    // for(let idx=0; idx<dataList.itemlist.length; idx++) {
    //     _result[idx].key = dataList.itemlist[idx].labelNm;
    //     _result[idx].value = dataList.itemlist[idx].labelCd;
    // }
    // return _result;
}

export const convertValueKey = (key) => {
    if( _map[key] == undefined) {
        return _map['기타상세'];
    }
    return _map[key];
}


export default function SearchBoxAutoComplete({dataList, dataListName, placeholder, index, setItem, title, minWidth, maxWidth, titleMinWidth, defaultvalue, fontSize}) {
    const dataListElement = useRef(null);
    const dispatch = useDispatch();

    const autocompleteKeyDown = ((e) => {
        if (e.target.value != undefined) {
            let ageidx = 0;
            let sexidx = 0;
            let dependidx = undefined;
            let cue = getCueFunc();
            
            const speakerDependency = document.getElementById('speaker-dependency');
            for(let idx=0; idx<9; idx++) {
                //화자
                let speaker = speakerDependency.children[idx].children[1].children[0].children[1].children[0].value;
                //발화자 연령
                ageidx = speakerDependency.children[idx].children[2].children[0].children[1].selectedIndex;
                // let age = speakerDependency.children[idx].children[2].children[0].children[1].children[ageidx].value;
                //성별
                sexidx = speakerDependency.children[idx].children[3].children[0].children[1].selectedIndex;
                // let sex = speakerDependency.children[idx].children[3].children[0].children[1].children[sexidx].value;
                
                if( e.target.value == speaker && speaker != undefined && speaker != '' ) {
                    dependidx = idx;
                    e.target.parentElement.parentElement.parentElement.children[3].children[1].selectedIndex = ageidx;
                    e.target.parentElement.parentElement.parentElement.children[4].children[1].selectedIndex = sexidx;
                    break;
                }
            }
            
            if(e.target.list.id.includes('subcategory')) {
                getTmpJSON().scenarioSelLabelInfo.subCategory.labelCd = convertValueKey(e.target.value);
                getTmpJSON().scenarioSelLabelInfo.subCategory.labelNm = e.target.value;
                createTmpJSON(getTmpJSON());
            }
            else if(e.target.list.id.includes('keyword')) {
                getTmpJSON().scenarioSelLabelInfo.keyword.labelCd = convertValueKey(e.target.value);
                getTmpJSON().scenarioSelLabelInfo.keyword.labelNm = e.target.value;
                createTmpJSON(getTmpJSON());
            }
            else if(e.target.list.id.includes('opinion')) {
                getTmpJSON().scenarioSelLabelInfo.opinion.labelCd = convertValueKey(e.target.value);
                getTmpJSON().scenarioSelLabelInfo.opinion.labelNm = e.target.value;
                createTmpJSON(getTmpJSON());
            }
            
            if( convertValueKey(e.target.value) == 'LBL_KND_23_999' ) {
                //기타상세
                const nextid = e.target.nextElementSibling.id;
                if( nextid.includes('speaker') ) {
                    cue[index].subtileSelLabelInfo.speaker.labelCd = convertValueKey(e.target.value);
                    cue[index].subtileSelLabelInfo.speaker.labelNm = e.target.value;    
                }
                else if( nextid.includes('comment') ) {
                    cue[index].subtileSelLabelInfo.placeType.labelCd = convertValueKey(e.target.value);
                    cue[index].subtileSelLabelInfo.placeType.labelNm = e.target.value;
                }
                saveAction(cue);
            }
            else if( convertValueKey(e.target.value).includes('KND_25') ) {
                //화자
                cue[index].subtileSelLabelInfo.speaker.labelCd = convertValueKey(e.target.value);
                cue[index].subtileSelLabelInfo.speaker.labelNm = e.target.value;
                
                // debugger;
                //KND_21 == 연령
                cue[index].subtileSelLabelInfo.speakerAge.labelCd = speakerDependency.children[dependidx]?.children[2].children[0].children[1].children[ageidx].value;
                cue[index].subtileSelLabelInfo.speakerAge.labelNm = speakerDependency.children[dependidx]?.children[2].children[0].children[1].children[ageidx].textContent;

                //KND_22 == 성별
                cue[index].subtileSelLabelInfo.speakerSex.labelCd = speakerDependency.children[dependidx]?.children[3].children[0].children[1].children[sexidx].value;
                cue[index].subtileSelLabelInfo.speakerSex.labelNm = speakerDependency.children[dependidx]?.children[3].children[0].children[1].children[sexidx].textContent;

                saveAction(cue);
            }
            else if( convertValueKey(e.target.value).includes('KND_23') ) {
                //장소
                cue[index].subtileSelLabelInfo.placeType.labelCd = convertValueKey(e.target.value);
                cue[index].subtileSelLabelInfo.placeType.labelNm = e.target.value;
                saveAction(cue);
            }

            // let _feedback = {
            //     'feedback': e.target.value,
            //     'SUB_BGN_HR_MS': e.target.parentElement.parentElement.parentElement.children[0].id,
            //     'userCheck': false,
            //     'inspectCheck': false,
            // };
            // dispatch(setFeedback({ 'feedback': _feedback }));
            // if (href.indexOf('work_template') == -1) {
            //     createDisplayNoneElement(e.target.parentElement.parentElement.parentElement);
            //     e.target.value = '';
            // }
            // createDisplayEmptyElement(e.target.parentElement.parentElement.parentElement.previousSibling);
        }
        //풀스크린이였으면 다시 풀스크린으로
        // if (getIsFullScreen()) {
        //     videoFullScreen();
        // }
    });
    createKeyValueSet(dataList);

    useEffect(() => {
        for (let idx = 0; idx < dataList?.itemlist?.length; idx++) {
            let option = document.createElement('option');
            option.value = dataList?.itemlist[idx]?.labelNm;
            if( option.value != '기타상세' ) {
                dataListElement.current.appendChild(option);
            }
        }

        const saveSubtitle = (cue) => {
            dispatch(setCue({cue}));
        }
        saveAction = _.debounce(saveSubtitle, 500);
    }, [dataList?.itemlist, dispatch]);
    if( setItem == 'fake') {
        return (
            <section style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', 'padding': '10px', 'maxWidth': maxWidth, 'minWidth': minWidth}} className={styles.search_container}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px', 'minWidth': titleMinWidth}}>{title}</div>
                <div className={styles.ibx_search_container}>
                    <input id={index} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder} defaultValue={defaultvalue} style={{'fontSize': fontSize}}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )
    }
    else if( setItem?.labelCd?.includes('_000')) {
        return (
            <section style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', 'padding': '10px', 'maxWidth': maxWidth, 'minWidth': minWidth}} className={styles.search_container}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px', 'minWidth': titleMinWidth}}>{title}</div>
                <div className={styles.ibx_search_container}>
                    <input id={index} onSelect={(e) => {autocompleteKeyDown(e)}} onKeyDown={autocompleteKeyDown} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )
    }
    else {
    // else if(setItem?.labelCd != 'LBL_KND_23_999') {
        return (
            <section style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', 'padding': '10px', 'maxWidth': maxWidth, 'minWidth': minWidth}} className={styles.search_container}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px', 'minWidth': titleMinWidth}}>{title}</div>
                <div className={styles.ibx_search_container}>
                    <input id={index} onSelect={(e) => {autocompleteKeyDown(e)}} onKeyDown={autocompleteKeyDown} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder} defaultValue={setItem?.labelNm}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )

    }
}