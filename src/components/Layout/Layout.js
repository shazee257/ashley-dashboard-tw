import styles from './Layout.module.css';
import Sidebar from "components/Sidebar/Sidebar";
import Topbar from "components/Topbar/Topbar";
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

const Layout = ({ children }) => {
    const [user, setUser] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        userData ? setUser(userData) : router.push("/login");
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
            <ToastContainer />
        </div>
    )
}

export default Layout