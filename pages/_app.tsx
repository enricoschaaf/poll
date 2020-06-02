import { AppProps } from "next/app"
import "../styles/index.css"

const App = ({ Component, pageProps }: AppProps) => (
  <div className="flex-grow p-4 sm:p-6 lg:p-8 flex">
    <div className="max-w-3xl mx-auto flex-grow">
      <Component {...pageProps} />
    </div>
  </div>
)

export default App
