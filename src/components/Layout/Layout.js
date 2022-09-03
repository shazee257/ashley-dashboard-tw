import styles from './Layout.module.css';
import Sidebar from "components/Sidebar/Sidebar";
import Topbar from "components/Topbar/Topbar";
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
    const [user, setUser] = useState("");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        userData && setUser(userData)
    }, [])

    return (
        <div className={styles.container}>
            <Topbar user={user} />
            <div className={styles.main}>
                <Sidebar />
                <div className='flex w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}
