import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import styles from '../../styles/Layout.module.css'
import { ToastMsg } from "../common/common_script";
import { getLayerPopupRefElement, getPayLayerPopupRefElement } from "../components/dashboard/dashboard";
import MenuItem from './menuitem';

const Viewport = ({ info, isAdmin }) => {
  let viewInfo = [];

  if (info != undefined) {
    viewInfo = info;
  }
  for (let idx = 0; idx < viewInfo.length; idx++) {
    if (viewInfo[idx].props.children != undefined) {
      if (viewInfo[idx].props.children?.props?.children == 'VIVO_편집') {
        return (
          <MenuItem></MenuItem>
        )
      }
    }
  }

  if(isAdmin) {
    //admin일 경우
    return (
      <ul className={styles.tabbed_primary_navigation}>
        <li className={styles.navigation_tab}>
          <Link href="/">
            <a onClick={(e) => {
              deleteCookie('tmp')
            }}>로그아웃</a>
          </Link>
        </li>
        <li className={styles.navigation_tab}>
          <Link href="">
            <a onClick={(e) => {
              getLayerPopupRefElement().current.style.display = 'block';
            }}>완료목록</a>
          </Link>
        </li>
        <li className={styles.navigation_tab}>
          <Link href="">
            <a onClick={(e) => {
              if(getCookie('tmp').includes('@datacrush.ai')) {
                window.open('/common/pay_page', '_blank' );
              }
              else {
                ToastMsg(`권한이 없습니다.`, 1500, null, null, 'warn');
              }
            }}>전체 완료목록</a>
          </Link>
        </li>
        <li className={styles.navigation_tab}>
          <Link href="">
            <a onClick={(e) => {
              if(getCookie('tmp').includes('@datacrush.ai')) {
                window.open('/common/worker_notice', '_blank' );
              }
              else {
                ToastMsg(`권한이 없습니다.`, 1500, null, null, 'warn');
              }
            }}>공지사항 등록</a>
          </Link>
        </li>
      </ul>
    )
  }
  else {
    //admin 아닐 경우
    return (
      <ul className={styles.tabbed_primary_navigation}>
        <li className={styles.navigation_tab}>
          <Link href="/">
            <a onClick={(e) => {
              deleteCookie('tmp')
            }}>로그아웃</a>
          </Link>
        </li>
        <li className={styles.navigation_tab}>
          <Link href="">
            <a onClick={(e) => {
              getLayerPopupRefElement().current.style.display = 'block';
            }}>완료목록</a>
          </Link>
        </li>
      </ul>
    )
  }
}

export default function NavBar({ info }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  let minWidth = '250px';

  useEffect(() => {
    const tmp = getCookie('tmp');
    if(tmp) {
      if(JSON.parse(tmp).prtEml.includes('@datacrush.ai')) {
        setAdmin(true);
      }
    }
  }, [admin]);
  
  if(admin) {
    minWidth = '450px';
  }

  return (
    <nav className={styles.nav}>
      {/* <h1>VI</h1><h4>sual</h4> <h1>VO</h1><h4>ice</h4> */}
      <h4 className={styles.menu_link}>
        <span className={styles.upper}>NIA</span>
        {/* <span className={styles.lower}>sual</span>
        <span className={styles.upper}>VO</span>
        <span className={styles.lower}>ice</span> */}
      </h4>
      <ul className={styles.tabbed_primary_navigation}>
        <li className={styles.navigation_tab}>
          <Link href="/">
            <a className={router.pathname === "/" ? styles.active : ""}>MAIN</a>
          </Link>
        </li>
      </ul>
      <div style={{ 'minWidth': minWidth }}>
        <li className={styles.navigation_tab}>
          <Viewport isAdmin={admin} info={info}></Viewport>
        </li>
      </div>
    </nav>
  );
}