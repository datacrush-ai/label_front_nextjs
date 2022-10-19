import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import styles from '../../styles/Layout.module.css'
import { getCueFunc } from './subtitle';
import { createTmpJSON, getTmpJSON } from './video_layout';

export default function SelectItem({response, setitem, types}) {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(setitem?.labelCd);

    const handleChangeSelect = (e) => {
        const cue = getCueFunc();
        const id = e.target.parentElement.parentElement.parentElement.parentElement.id.split('_')[0];
        const target_value = e.target.value;
        const flag_value = 'LBL_KND_00_000';
        setSelected(target_value);

        if( target_value.includes('KND_00') ) {
            flag_value = e.target.children[1].value;
            target_value = 'LBL_KND_00_000';
        }
        
        if( target_value.includes('KND_11') || flag_value.includes('KND_11') ) {
            getTmpJSON().scenarioSelLabelInfo.category.labelCd = target_value;
            getTmpJSON().scenarioSelLabelInfo.category.labelNm = e.target.selectedOptions[0].text;
            createTmpJSON(getTmpJSON());
        }
        else if( target_value.includes('KND_12') || flag_value.includes('KND_12') ) {
            getTmpJSON().scenarioSelLabelInfo.subCategory.labelCd = target_value;
            getTmpJSON().scenarioSelLabelInfo.subCategory.labelNm = e.target.selectedOptions[0].text;
            createTmpJSON(getTmpJSON());
        }
        else if( target_value.includes('KND_13') || flag_value.includes('KND_13') ) {
            getTmpJSON().scenarioSelLabelInfo.keyword.labelCd = target_value;
            getTmpJSON().scenarioSelLabelInfo.keyword.labelNm = e.target.selectedOptions[0].text;
            createTmpJSON(getTmpJSON());
        }
        else if( target_value.includes('KND_14') || flag_value.includes('KND_14') ) {
            getTmpJSON().scenarioSelLabelInfo.opinion.labelCd = target_value;
            getTmpJSON().scenarioSelLabelInfo.opinion.labelNm = e.target.selectedOptions[0].text;
            createTmpJSON(getTmpJSON());
        }
        else if( target_value.includes('KND_15') || flag_value.includes('KND_15') ) {
            getTmpJSON().scenarioSelLabelInfo.conversationSpeakers.labelCd = target_value;
            getTmpJSON().scenarioSelLabelInfo.conversationSpeakers.labelNm = e.target.selectedOptions[0].text;
            createTmpJSON(getTmpJSON());
        }
        else if( target_value.includes('KND_21') || flag_value.includes('KND_21') ) {
            //발화자 연령
            cue[id].subtileSelLabelInfo.speakerAge.labelCd = target_value;
            cue[id].subtileSelLabelInfo.speakerAge.labelNm = e.target.selectedOptions[0].text;
        }
        else if( target_value.includes('KND_22') || flag_value.includes('KND_22') ) {
            //성별
            cue[id].subtileSelLabelInfo.speakerSex.labelCd = target_value;
            cue[id].subtileSelLabelInfo.speakerSex.labelNm = e.target.selectedOptions[0].text;
        }
        else if( target_value.includes('KND_23') ) {
            //장소
            cue[id].subtileSelLabelInfo.placeType.labelCd = target_value;
            cue[id].subtileSelLabelInfo.placeType.labelNm = e.target.selectedOptions[0].text;
        }
        else if( target_value.includes('KND_24') ) {
            //중첩음
            cue[id].subtileSelLabelInfo.speakerOvrVoc.labelCd = target_value;
            cue[id].subtileSelLabelInfo.speakerOvrVoc.labelNm = e.target.selectedOptions[0].text;
        }
        
        dispatch(setCue({cue}));
    }

    // console.log(selected)
    
    if( types == 'subtitle' ) {
        return (
            <>
                <style jsx>{`
                select {
                    -webkit-appearance:none; /* 크롬 화살표 없애기 */
                    -moz-appearance:none; /* 파이어폭스 화살표 없애기 */
                    appearance:none; /* 화살표 없애기 */
                    text-align-last: center;
                }
                `}
                </style>
                <section className={styles.subtitle_edit_content_thumbnail}>
                <div style={{'whiteSpace': 'nowrap', 'paddingRight': '10px'}}>{response?.title}</div>
                <select className={"block py-2 px-4 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
                        onChange={handleChangeSelect}
                        // onBlur={(e) => {
                        //     console.log(e);
                        //     return handleChangeSelect(e)
                        // }}
                        // onKeyDown={(e) => {
                        //     console.log(e);
                        //     return handleChangeSelect(e)
                        // }}
                        // onKeyUp={(e) => {
                        //     console.log(e);
                        //     return handleChangeSelect(e)
                        // }}
                        defaultValue={selected}
                >
                    {
                        response?.itemlist?.map((arr, idx) => {
                            return(
                                <option key={`aa_${arr.labelCd}_${arr.labelNm}_${idx}`} 
                                        value={arr.labelCd}
                                >
                                    {arr.labelNm}
                                </option>
                            )
                        })
                    }
                </select>
                </section>
            </>
        )
    }
    else {
        return (
            <>
                <style jsx>{`
                select {
                    -webkit-appearance:none; /* 크롬 화살표 없애기 */
                    -moz-appearance:none; /* 파이어폭스 화살표 없애기 */
                    appearance:none; /* 화살표 없애기 */
                    text-align-last: center;
                }
                `}
                </style>
                <section className={styles.subtitle_edit_content_thumbnail}>
                <div style={{'minWidth': '120px', 'paddingRight': '10px'}}>{response?.title}</div>
                <select className={"block py-2 px-4 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
                        onChange={handleChangeSelect}
                        defaultValue={selected}
                >
                    {
                        response?.itemlist?.map((arr, idx) => {
                            return(
                                <option key={`aa_${arr.labelCd}_${arr.labelNm}_${idx}`} 
                                        value={arr.labelCd}
                                >
                                    {arr.labelNm}
                                </option>
                            )
                        })
                    }
                </select>
                </section>
            </>
        )
    }
}

