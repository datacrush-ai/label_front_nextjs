import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCue } from '../../store/nia_layout/StoreCueSlice';
import styles from '../../styles/Layout.module.css'
import { getCueFunc } from './subtitle';

export default function SelectItem({response, setitem, types}) {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(setitem?.labelCd);

    const handleChangeSelect = (e) => {
        const cue = getCueFunc();
        const id = e.target.parentElement.parentElement.parentElement.parentElement.id.split('_')[0];
        setSelected(e.target.value);

        if( e.target.value.includes('21') ) {
            cue[id].subtileSelLabelInfo.speakerAge.labelCd = e.target.value;
            cue[id].subtileSelLabelInfo.speakerAge.labelNm = e.target.selectedOptions[0].text;
        }
        else if( e.target.value.includes('2') ) {
            cue[id].subtileSelLabelInfo.speakerSex.labelCd = e.target.value;
            cue[id].subtileSelLabelInfo.speakerSex.labelNm = e.target.selectedOptions[0].text;
        }
        else if( e.target.value.includes('16') ) {
            cue[id].subtileSelLabelInfo.placeType.labelCd = e.target.value;
            cue[id].subtileSelLabelInfo.placeType.labelNm = e.target.selectedOptions[0].text;
        }

        dispatch(setCue({cue}))
    }
    
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

