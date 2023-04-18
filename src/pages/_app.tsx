import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { staticPath } from '~/utils/$path'
import { MantineProvider } from '@mantine/core'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href={staticPath.favicon_png} />
      </Head>
      <MantineProvider
        theme={{ colorScheme: 'light' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}

export default MyApp
