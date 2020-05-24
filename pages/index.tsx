import { Form } from "components/Form"
import Head from "next/head"

const Index = () => (
  <>
    <Head>
      <title>Create your pool</title>
    </Head>
    <div className="flex-grow p-4 sm:p-6 lg:p-8 flex">
      <div className="max-w-3xl mx-auto flex-grow flex justify-center items-center">
        <Form />
      </div>
    </div>
  </>
)

export default Index
