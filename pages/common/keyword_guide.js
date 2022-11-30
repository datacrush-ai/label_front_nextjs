import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from '../../styles/Layout.module.css'
import _ from "lodash";
import { getCookie } from "cookies-next";
import { sendFetch } from "./common_script";


const KeywordGuideDetailComponent = ({keyword, detail}) => {
    return (
        <div style={{
            'display': 'flex',
            'flexDirection': 'row',
            'alignItems': 'center',
            'backgroundColor': '#303030',
            'borderStyle': 'solid',
            'borderBlockWidth': '1px',
            'color': 'white',
            'flexFlow': 'wrap'
        }}>
            {
                detail?.map((arr, idx) => {
                    if(detail.length == 1) {
                        return(
                            <div key={`${keyword}`} style={{'fontWeight': 'bold', 'fontSize': '1.5rem'}}>
                                <span>&#91;{keyword}&#93;</span>
                                <span>&#61;&#160;</span>
                                <span style={{'fontSize': '1rem', 'fontWeight': 'normal', 'verticalAlign': 'middle'}}>{arr.labelNm}</span>
                            </div>
                        )
                    }

                    if( idx == 0 ) {
                    // if( keyword != arr.labelNm ) {
                        //Head
                        return(
                            <div key={`${keyword}`} style={{'fontWeight': 'bold', 'fontSize': '1.5rem'}}>
                                <span>&#91;{keyword}&#93;</span>
                                <span>&#61;&#160;</span>
                                <span style={{'fontSize': '1rem', 'fontWeight': 'normal', 'verticalAlign': 'middle'}}>{arr.labelNm}&#44;</span>
                            </div>
                        )
                    }
                    else if( idx == detail.length-1 ) {
                        //Last Child
                        return(
                            <span style={{'fontSize': '1rem', 'fontWeight': 'normal'}}
                                key={`${arr.labelCd}${idx}`}>{arr.labelNm}</span>
                        )
                    }
                    else {
                        //Child
                        return(
                            <span style={{'fontSize': '1rem', 'fontWeight': 'normal'}}
                                key={`${arr.labelCd}${idx}`}>{arr.labelNm}&#44;&#160;</span>
                        )
                    
                    }
                })
            }
        <br></br>
        <br></br>
        </div>
    )
};

const KeywordGuideTemplate = ({keyword}) => {
    let render_list = [];
    for(let item in keyword) {
        render_list.push(keyword[item]);
    }
    return(
        render_list?.map((arr, idx) => {
            return (
                <div key={idx}>
                    <KeywordGuideDetailComponent keyword={arr.labelNm} detail={arr.labelList}></KeywordGuideDetailComponent>
                    <br></br>
                </div>
            )
        })
    )
}

export default function KeywordGuide() {
    const [response, setResponse] = useState([]);
    const initFunction = useCallback(async() => {
        const keywordMap = await sendFetch('/labeltool/reqKeywordMap', {}, {method: 'POST'});
        setResponse(keywordMap);
    }, []);

    useEffect(() => {
        initFunction();
    }, [initFunction])

    return (
        <div className={styles.text_area}>
            <KeywordGuideTemplate keyword={response}></KeywordGuideTemplate>
        </div>
    )
}

export async function getServerSideProps(context) {
    const req = context.req;
    const res = context.res;
    const cookie = JSON.parse(getCookie('tmp', {req, res}));

    if(cookie == undefined) {
        //쿠키가 없을 경우
        return {
            redirect: {
                permanent: false,
                destination: '/common/illegal'
            }
        }
    }

    return { 
      props: { 
        // response
      } 
    }
  }