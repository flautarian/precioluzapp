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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px 10px 20px',
        width: '100vdw',
        height: '100vh'
      }}>
        {children}
      </main>

    </>
  )
};
