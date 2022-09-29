import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { setuuid } from '../../store/nia_common/StoreUUID';
import { useDispatch, useSelector } from 'react-redux';

export default function KakaoCallback({login_uuid, context_path}) {
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setuuid({'X-nia-id':login_uuid}));
        setTimeout(() => {
            router.push(context_path);
        }, 100);
    }, [router, login_uuid, context_path, dispatch]);

    return (
        // <h2>로그인 중</h2>
        <div className={"relative rounded-xl overflow-auto p-8 flex items-center justify-center h-[94vh]"}>
            <button type={"button"} className={"inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"} disabled={""}>
                <svg className={"animate-spin -ml-1 mr-3 h-5 w-5 text-white"} xmlns={"http://www.w3.org/2000/svg"} fill={"none"} viewBox={"0 0 24 24"}>
                    <circle className={"opacity-25"} cx={"12"} cy={"12"} r={"10"} stroke={"currentColor"} strokeWidth={"4"}></circle>
                    <path className={"opacity-75"} fill={"currentColor"} d={"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"}></path>
                </svg>
                로그인 중입니다...
            </button>
        </div>
    );
}

export async function getServerSideProps(context) {
// export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
    const query_code = context.query.code;
    const res = await fetch(`https://datacrush.asuscomm.com:31500/auth?code=${query_code}`, {
        headers: {
            'Access-Control-Allow-Origin':'https://wooki.vivo.best, https://prodlabelfront.datacrs.ai',
        },
    });
    let code;
    let login_uuid = '';
    let context_path = '';

    if( res.status === 200 ) {
        code = await res.json();
        login_uuid = code['X-nia-id'];
        context_path = '/';
    }
    else {
        context_path = '/CustomPage404';
    }

    return {
        props: { 
            login_uuid,
            context_path
         }, // will be passed to the page component as props
    }
    
// });
};