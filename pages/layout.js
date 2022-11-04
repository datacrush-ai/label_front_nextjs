import NavBar from "./layouts/nav";
import FooterLoadScript from "./layouts/footer-load-script";

const Viewport = ({ info }) => {
    let viewInfo = []
    if (info != undefined) {
        viewInfo = info;
    }
    for (let idx = 0; idx < viewInfo.length; idx++) {
        if (viewInfo[idx].props.children != undefined) {
            if (viewInfo[idx].props.children?.props?.children == 'NIA_편집') {
                return (
                    <section style={{ 'height': '95vh', 'position': 'relative' }}>{viewInfo}</section>
                )
            }
        }
    }
    return (
        <section>{viewInfo}</section>
    )
}

export default function Layout({ children }) {
    return (
        <main>
            {/* <ServerConfig></ServerConfig> */}
            <FooterLoadScript></FooterLoadScript>
            <NavBar info={children} />
            <Viewport info={children}></Viewport>
        </main>
    );
}