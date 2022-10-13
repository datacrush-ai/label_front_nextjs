import { useSelector } from 'react-redux';
import { getuuid } from '../../store/nia_common/StoreUUID';
import { useEffect } from 'react';
import { sendFetch, ToastMsg } from './common_script';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

async function loginAccess() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // const url = 'https://datacrush.asuscomm.com:30000/labeltool/login';
    const url = '/labeltool/login';
    const param = {
        "userInfo": {
            "prtEml": email,
            "prtPw": password
        }
    }
    const result = await sendFetch(url, param, {method: 'POST'});
    return result;
}
async function loginAuth(result) {
    if( result.userInfo != null ) {
        const cookie_data = {
            prtAin: result.userInfo.prtAin,
            prtEml: result.userInfo.prtEml,
            prtNm: result.userInfo.prtNm,
        }
        setCookie('tmp', cookie_data);
        ToastMsg(`${result.userInfo.prtNm}님 환영합니다.`, 3000, null, null, 'pass');
        return true;
    }
    else {
        ToastMsg(`로그인에 실패했습니다. \n사유: 아이디, 패스워드를 확인해주세요.`, 3000, null, null, 'warn');
        return false;
    }
}

export default function LoginModule() {
    const router = useRouter();
    const uuid = useSelector(getuuid);
    useEffect(() => {
        // console.log(uuid);
    }, [uuid])
    return (
        <section className={"bg-gray-50 bg-gray-900 flex justijustify-center items-center h-[95vh]"}>
            <div style={{'minWidth': '60%'}} className={"flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"}>
                <div className={"w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700"}>
                    <div className={"p-6 space-y-4 md:space-y-6 sm:p-8"}>
                        <h1 className={"text-xl font-bold leading-tight tracking-tight md:text-2xl text-white"}>
                            Sign in to your account
                        </h1>
                        <div>
                            <label htmlFor={"email"} className={"block mb-2 text-sm font-medium text-white"}>Your email</label>
                            <input onKeyDown={(e) => {
                                if(e.key == 'Enter') { 
                                    btnlogin.click(); 
                                }}
                            } type={"email"} name={"email"} id={"email"} className={"bg-gray-50 border text-gray-900  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"} placeholder={"name@company.com"} required={""}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor={"password"} className={"block mb-2 text-sm font-medium text-white"}>Password</label>
                            <input onKeyDown={(e) => {
                                if(e.key == 'Enter') { 
                                    btnlogin.click(); 
                                }}
                            } type={"password"} name={"password"} id={"password"} placeholder={"••••••••"} className={"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"} required={""}>
                            </input>
                        </div>
                        <button id={'btnlogin'} onClick={async(e) => {
                            const info = await loginAccess();
                            const result = await loginAuth(info);
                            if(result) {
                                router.push('/components/dashboard/dashboard');
                            }
                        }} type={"submit"} className={"w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"}>Sign in</button>
                    </div>
                </div>
            </div>
        </section>
    );
}