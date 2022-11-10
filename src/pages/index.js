// import styles from 'styles/Home.module.css';
// import { useRouter } from 'next/router';

// export default function Home() {
//     const router = useRouter();
//     // if local storage has a token, redirect to dashboard
//     // const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
//     // if (!user) {
//     //     router.push("/login");
//     // }


//     return (
//         <div className={styles.main}>
//             <h2 className={styles.productTitle}>Dashboard Section</h2>

//             <main className={styles.main}>

//             </main>

//         </div>
//     )
// }

import Login from "components/Login/Login";

export default function Home() {
    return (
        <div>
            <Login />
        </div>
    )
}
