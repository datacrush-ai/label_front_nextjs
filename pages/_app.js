import Head from 'next/head'
import '../styles/globals.css'
import CommonScript from './common/common_script'
import Layout from './layout'
import { wrapper } from '../store'
import { KAKAO_JS_KEY } from '../config/serverconfig'
import Script from 'next/script'

function kakaoInit() {
  window.Kakao.init(KAKAO_JS_KEY);
}

function NIA_app({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>{Component?.title}</title>
      </Head>
      <CommonScript></CommonScript>
      <Component {...pageProps} />
      <Script id={"kakaojs"} src='https://developers.kakao.com/sdk/js/kakao.js' onLoad={kakaoInit}> </Script>
    </Layout>
  )
}

export default wrapper.withRedux(NIA_app)
