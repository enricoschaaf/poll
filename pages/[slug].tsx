import { PrismaClient } from "@prisma/client"
import { Layout } from "components/Layout"
import { Poll } from "components/Poll"
import dynamic from "next/dynamic"

const Error = dynamic(() => import("../components/Error"))
const prisma = new PrismaClient()

export async function getStaticProps({ params: { slug } }) {
  const data = await prisma.poll.findOne({
    select: {
      title: true,
      options: {
        select: { id: true, name: true, votes: true },
        orderBy: { createdAt: "asc" }
      },
      allowMultipleOptions: true
    },
    where: { slug }
  })
  if (data) {
    return {
      props: { data }
    }
  }
  return { props: {} }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

const Slug = ({ data }) => {
  if (!data) return <Error statusCode={404} />
  if (data)
    return (
      <Layout>
        <Poll data={data} />
      </Layout>
    )
}

export default Slug
