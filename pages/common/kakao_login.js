import styles from '../../styles/Home.module.css'
import { useSelector } from 'react-redux';
import { getuuid } from '../../store/nia_common/StoreUUID';
import { useEffect } from 'react';
import { CLIENT_ID, LOGOUT_REDIRECT_URI } from '../../config/serverconfig';

async function kakaoAuth() {
    window.Kakao.Auth.authorize({
        redirectUri: `${location.origin}/common/kakao_callback`,
    });
}

async function kakaoLogout() {

    // "https://kapi.kakao.com/v1/user/logout"

    window.Kakao.API.request({
        url: '/v1/user/unlink',
        // url: `/oauth/logout?client_id=${CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`,
        success: function(response) {
            console.log(response);
        },
        fail: function(error) {
            console.log(error);
        },
    });
};

export default function KakaoLogin() {
    const uuid = useSelector(getuuid);
    useEffect(() => {
        console.log(uuid);
    }, [uuid])
    return (
        <div className={styles.container}>
            <button onClick={kakaoAuth}>카카오 로그인</button>
            <br></br>
            <button onClick={kakaoLogout}>카카오 로그아웃</button>
            <br></br>
            <button onClick={(e) => console.log(uuid)}>카카오 로그인 여부</button>
        </div>
    );
}