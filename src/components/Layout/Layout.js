import styles from './Layout.module.css';
import Sidebar from "components/Sidebar/Sidebar";
import Topbar from "components/Topbar/Topbar";
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const router = useRouter();
    return (
        <>
            {(router.pathname !== "/") ?
                <div className={styles.container}>
                    <Topbar />
                    <div className={styles.main}>
                        <Sidebar />
                        <div className='flex w-full'>
                            {children}
                        </div>
                    </div>
                </div>
                :
                <div className=''>
                    {children}
                </div>
            }
        </>
    )
}
