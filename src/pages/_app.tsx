import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.css";
import type { AppType, AppProps } from "next/app";
import { trpc } from "~/utils/trpc";

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Scroobious</title>
        <meta name="description" content="Scroobious" />
      </Head>
      <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastContainer />
    </>
  );
};

export default trpc.withTRPC(App);
