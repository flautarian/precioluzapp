import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Navbar } from '@nextui-org/react';

interface Props {
  title?: string;
  children?: ReactNode;
}


const origin = (typeof window === 'undefined') ? '' : window.location.origin;


export const Layout: FC<Props> = ({ title, children }) => {


  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="author" content="Facundo Giacconi" />
        <meta name="description" content={`Información sobre el precio de la luz de hoy`} />
        <meta property="og:title" content={`Información sobre el precio de la luz (€/Mwh)`} />
      </Head>

      <Navbar />

      <main style={{
        padding: '0px 20px'
      }}>
        {children}
      </main>

    </>
  )
};
