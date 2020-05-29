import { Form } from "components/Form"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    router.prefetch("/[slug]", "/")
  }, [router])
  return (
    <>
      <Head>
        <title>Create your pool</title>
      </Head>
      <div className="flex-grow p-4 sm:p-6 b-gray-50 lg:p-8 flex">
        <div className="max-w-3xl mx-auto flex-grow flex justify-center items-center">
          <Form />
        </div>
      </div>
    </>
  )
}

export default Index
