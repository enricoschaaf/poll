import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Meta description" />
          <meta name="theme-color" content="#f4f5f7" />
          <link rel="icon" type="image/svg+xml" href="favicon.svg" />
          <link
            rel="preload"
            href="https://rsms.me/inter/font-files/Inter.var.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body className="bg-gray-100 text-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
