import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/Layout.module.css';
import Image from 'next/image';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import { getCueFunc } from './subtitle';

let href = '';
let _result = [];
let _map = {};
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


export default function SearchBoxAutoComplete({dataList, dataListName, placeholder, index, setItem}) {
    const dataListElement = useRef(null);
    const dispatch = useDispatch();

    const autocompleteKeyDown = ((e) => {
        if (e.key == 'Enter' || e.key == undefined) {
            if (e.target.value != '' && e.target.value != undefined) {
                // console.log(e.target.id, e.target.value);
                let cue = getCueFunc();
                if( convertValueKey(e.target.value).includes('KND_23') ) {
                    cue[index].subtileSelLabelInfo.placeType.labelCd = convertValueKey(e.target.value);
                    cue[index].subtileSelLabelInfo.placeType.labelNm = e.target.value;
                    console.log(cue[index]?.subtileSelLabelInfo?.placeType);
                    dispatch(setCue({cue}));
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
        }
    });
    createKeyValueSet(dataList);

    useEffect(() => {
        // console.log(dataList)
        // href = location.href;
        for (let idx = 0; idx < dataList?.itemlist?.length; idx++) {
            let option = document.createElement('option');
            option.value = dataList?.itemlist[idx]?.labelNm;
            dataListElement.current.appendChild(option);
        }
    }, [dataList?.itemlist]);
    // console.log(setItem.labelCd, setItem.labelCd.includes('_000'))
    if( setItem?.labelCd?.includes('_000')) {
        return (
            <section className={styles.search_container}>
                <div className={styles.ibx_search_container}>
                    <input id={index} onSelect={(e) => {autocompleteKeyDown(e)}} onKeyDown={autocompleteKeyDown} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )
    }
    else {
        return (
            <section className={styles.search_container}>
                <div className={styles.ibx_search_container}>
                    <input id={index} onSelect={(e) => {autocompleteKeyDown(e)}} onKeyDown={autocompleteKeyDown} type={"text"} list={dataListName} className={styles.ibx_product} placeholder={placeholder} defaultValue={setItem?.labelNm}/>
                    <datalist ref={dataListElement} id={dataListName}></datalist>
                </div>
            </section>
        )

    }
}