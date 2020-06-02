import { Form } from "components/Form"
import { Layout } from "components/Layout"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Index = () => {
  const { prefetch } = useRouter()
  useEffect(() => {
    prefetch("/[slug]", "/")
  }, [prefetch])
  return (
    <>
      <Head>
        <title>Create your poll</title>
      </Head>
      <Layout>
        <Form />
      </Layout>
    </>
  )
}

export default Index
