import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../styles/Layout.module.css';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import { getCueFunc } from './subtitle';
import { createTmpJSON, getTmpJSON } from './video_layout';

let href = '';
let _result = [];
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

const convertValueKey = (key) => {
    if( _map[key] == undefined) {
        return _map['기타상세'];
    }
    return _map[key];
}


export default function SearchBoxAutoComplete({dataList, dataListName, placeholder, index, setItem, title, minWidth}) {
    const dataListElement = useRef(null);
    const dispatch = useDispatch();

    const autocompleteKeyDown = ((e) => {
        if (e.target.value != undefined) {
        // if (e.target.value != '' && e.target.value != undefined) {
            // console.log(e.target.id, e.target.value);
            let cue = getCueFunc();
            // console.log(e.target.value, convertValueKey(e.target.value));
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
            else if( convertValueKey(e.target.value).includes('KND_23') ) {
                cue[index].subtileSelLabelInfo.placeType.labelCd = convertValueKey(e.target.value);
                cue[index].subtileSelLabelInfo.placeType.labelNm = e.target.value;
                // dispatch(setCue({cue}));
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
    
    
    if( setItem?.labelCd?.includes('_000')) {
        return (
            <section style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', 'padding': '10px'}} className={styles.search_container}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px', 'minWidth': minWidth}}>{title}</div>
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
            <section style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', 'padding': '10px'}} className={styles.search_container}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px', 'minWidth': minWidth}}>{title}</div>
                <div className={styles.ibx_search_container}>
                    <input id={index} onSelect={(e) => {autocompleteKeyDown(e)}} onKeyDown={autocompleteKeyDown} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder} defaultValue={setItem?.labelNm}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )

    }
}