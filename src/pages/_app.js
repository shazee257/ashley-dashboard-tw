import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from 'components/Layout/Layout';
import LoadingPanel from "components/Loader";
import Router from "next/router";
import Login from "components/Login/Login";
import cookie from 'js-cookie';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const token = cookie.get('token');

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


  if (!token) {
    return (
      <>
        {loading && <LoadingPanel />}
        <Login />
        <ToastContainer />
      </>
    );
  }

  return (
    <Layout>
      {loading && <LoadingPanel />}
      <Component {...pageProps} />
      <ToastContainer />
    </Layout>
  );
}

export default MyApp;
