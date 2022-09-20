import styles from './Layout.module.css';
import Sidebar from "components/Sidebar/Sidebar";
import Topbar from "components/Topbar/Topbar";

export default function Layout({ children }) {
    return (
        <div className={styles.container}>
            <Topbar />
            <div className={styles.main}>
                <Sidebar />
                <div className='flex w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}
