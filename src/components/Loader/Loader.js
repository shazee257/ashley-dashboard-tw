// const loading = require('assets/loading3.gif');
// import Image from 'next/image'

export default function LoadingPanel() {
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
            <h1 style={{ color: 'white', fontSize: '36px' }}>Loading....</h1>
            {/* <Image style={{ zIndex: 101 }}
                src={loading} alt="Loading" width={100} height={100}
            /> */}
        </div>
    )
};