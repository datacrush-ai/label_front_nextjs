import { getCookie } from 'cookies-next';
import styles from '../styles/Home.module.css'
import KakaoLogin from './common/kakao_login';
import LoginModule from './common/login_module';

export default function Home() {

  return (
    <div className={styles.container}>
      <LoginModule></LoginModule>
    </div>
  )
}

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  const cookie = getCookie('tmp', {req, res});
  if(cookie != undefined) {
      return {
          redirect: {
              permanent: false,
              destination: '/components/dashboard/dashboard'
          }
      }
  }

  return { props: {  } }
}