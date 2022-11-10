import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from 'components/Layout/Layout';
import LoadingPanel from "components/Loader";
import Router, { useRouter } from "next/router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = ({ Component, pageProps }) => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("_app mounted");

    const start = () => {
      console.log("start");
      setLoading(true);
    };

    const end = () => {
      console.log("ended");
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };

  }, []);

  // if (router.pathname === "/login") {
  //   return (
  //     <>
  //       {loading && <LoadingPanel />}
  //       <Component {...pageProps} />
  //       <ToastContainer />
  //     </>
  //   );
  // }


  return (
    <>
      {/* {router.pathname == "/login" ?
        <Component {...pageProps} />
        : */}
      <Layout>
        {loading && <LoadingPanel />}
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
      {/* } */}
    </>
  );
}

export default App;