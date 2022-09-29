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