import {useRouter} from "next/router";
import { useEffect } from "react";

let _uuid = '';
export const CLIENT_ID = '2bb737dcee54cffa7b1313d2a17e6b18';
export const KAKAO_JS_KEY = 'a8b6d4f5b3cb2f890b99c9507a2a99ca';
export const LOGOUT_REDIRECT_URI = 'https://wooki.vivo.best'

export let getUUID = () => {
    return _uuid;
};
export let setUUID = (uuid) => {
    _uuid = uuid;
};
// let host = '';
let host =  'http://localhost:30501'
let platform = '';
let createPlatform = (navigator_platform) =>  {
    platform = navigator_platform;
}
let createHost = (url) => {
    host = url;
}
export let getPlatform = () => {
    return platform;
}
export let getHost = () => {
    // host = location.origin.replaceAll('30500', '30501')
    // if(process.env.NODE_ENV === 'development') {
        //     host = `http://116.120.27.245:30501`
        // }
        // else if(process.env.NODE_ENV !== 'development') {
            //     host = 'http://vivoservernestjs-env.eba-p5f3fzvs.ap-northeast-2.elasticbeanstalk.com'
            // }
            
            // let loc_href = location.href.split('/');
            // host = `${loc_href[0]}//${loc_href[2]}`
            
    return host;
}

export default function ServerConfig() {
    const router = useRouter();
    let host =  'http://localhost:30501'
    
    // console.log(router);
    // debugger;
    // console.log(router.route)
    useEffect(() => {
        createHost(location.origin.replaceAll('30500', '30501'));
        createPlatform(window.navigator.platform.toUpperCase());
        return () => {

        }
    }, [])

    return(
        <></>
    );
}