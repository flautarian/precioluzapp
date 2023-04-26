import '@/styles/globals.css'
import { darkTheme } from '@/themes/darktheme'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={ darkTheme }>
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
