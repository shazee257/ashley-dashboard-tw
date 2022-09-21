import styles from './Loader.module.css';

function Loader() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            backgroundPosition: 'center',
            width: '100%',
            zIndex: 100,
            height: '100%',
            opacity: 0.7,

        }}>
            <div className={styles.loaderWrapper}>
                <div className={`${styles.loader} ${styles.loaderOuter}`}>
                    <div className={`${styles.loader} ${styles.loaderInner}`}></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;