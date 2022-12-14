import styles from '../../styles/Layout.module.css'

export const TextAreaContainer = (data) => {
    let subtitle = data.subtitle;
    // let duration = getDuration()*1000;
    // subtitle.arr.subBgnHrMs
    // console.log(subtitle)
    

    // let layout = data.layout;
    // const dispatch = useDispatch();
    // const _cue = useSelector(getCue);

    // createWaveTexareaContainerRef(waveTexareaContainerRef);
    // createWaveTexareaRef(waveTexareaRef);

    if (subtitle.arr != undefined) {
        return (
            <div className={styles.subtitle_container}>
                <textarea id={subtitle.id} onChange={(e) => {
                    // let text_check = textChangeEvent(e.target.value);
                    // TextCheck(e, text_check);
                }} 
                className={styles.subtitle_board} 
                defaultValue={subtitle.arr?.subCn == undefined ? '' : subtitle.arr?.subCn}
                readOnly
                key={`${subtitle.arr?.subSnm}_${subtitle.arr?.subBgnHrMs}`}
                >
                </textarea>
            </div>
        )
    }
    else {
        return (
            <div className={styles.subtitle_container}>
                <textarea id={subtitle.id} onChange={(e) => {
                    // let text_check = textChangeEvent(e.target.value);
                    // TextCheck(e, text_check);
                }}
                className={styles.subtitle_board} 
                defaultValue={''}
                readOnly
                key={`${subtitle.arr?.subSnm}_${subtitle.arr?.subBgnHrMs}`}
                >
                </textarea>
            </div>
        )
    }
}

export default function SubtitleTextInfo(subtitle) {
    return (
        <>
            <TextAreaContainer subtitle={subtitle}></TextAreaContainer>
            {/* <div className={styles.text_length_container}>
                <TextLengthContainer text_check={text_check}></TextLengthContainer>
            </div> */}
        </>
    )
};