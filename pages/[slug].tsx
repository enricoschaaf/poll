import { PrismaClient } from "@prisma/client"
import Head from "next/head"
import { useState } from "react"
import { useForm } from "react-hook-form"

const prisma = new PrismaClient()

export async function getStaticProps({ params: { slug } }) {
  const data = await prisma.poll.findOne({
    select: {
      title: true,
      options: {
        select: { id: true, name: true, votes: true },
        orderBy: { createdAt: "desc" }
      },
      allowMultipleOptions: true
    },
    where: { slug }
  })
  return {
    props: { data }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

const Slug = ({ data }) => {
  const [status, setStatus] = useState("success")
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (inputData, e) => {
    if (inputData.option) {
      setStatus("loading")
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData)
      })
      setStatus("success")
      return reset()
    }
    if (Object.entries(inputData).find(([, value]) => value == true)) {
      setStatus("loading")
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData)
      })
      setStatus("success")
      return reset()
    }

    ;[...e.target].find(({ type }) => type === "checkbox").select()
  }
  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <div className="flex-grow p-4 sm:p-6 lg:p-8 flex">
        <div className="max-w-3xl mx-auto flex-grow flex justify-center items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white overflow-hidden shadow rounded-lg w-full"
          >
            <div className="px-4 py-5 sm:p-6 grid gap-4 sm:gap-6 lg:gap-8">
              <h1 className="text-indigo-600 font-semibold text-lg">
                {data?.title}
              </h1>
              {data?.allowMultipleOptions
                ? data.options.map(({ id, name }) => (
                    <Checkbox
                      register={register}
                      key={id}
                      id={id}
                      name={name}
                    />
                  ))
                : data?.options.map(({ id, name }) => (
                    <Radio register={register} key={id} id={id} name={name} />
                  ))}
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 grid grid-flow-col">
              <div className="self-start">
                <ShareButton title={data?.title} />
              </div>
              <div className="self-end grid justify-end grid-flow-col col-gap-4">
                <VoteButton status={status} />
                <ShowResultButton />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

const Checkbox = ({ id, name, register }) => (
  <div className="relative flex items-start">
    <div className="absolute flex items-center h-5">
      <input
        id={id}
        name={id}
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        ref={register}
      />
    </div>
    <label
      htmlFor={id}
      className="pl-7 text-sm leading-5 font-medium text-gray-500"
    >
      {name}
    </label>
  </div>
)

const Radio = ({ id, name, register }) => (
  <div className="flex items-center">
    <input
      id={id}
      name="option"
      type="radio"
      value={id}
      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
      ref={register({ required: true })}
    />
    <label htmlFor={id} className="ml-3">
      <span className="block text-sm leading-5 font-medium text-gray-500">
        {name}
      </span>
    </label>
  </div>
)

const VoteButton = ({ status }) => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="submit"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 w-16 justify-center"
    >
      {status === "success"
        ? "Vote"
        : status === "loading" && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          )}
    </button>
  </span>
)

const ShowResultButton = () => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 hover:border-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-blue active:text-indigo-700 active:bg-indigo-50 transition ease-in-out duration-150"
    >
      Show result
    </button>
  </span>
)

const ShareButton = ({ title }) => (
  <button
    type="button"
    onClick={() => {
      //@ts-ignore
      if (navigator.share) {
        //@ts-ignore
        navigator.share({ title, url: location.href })
      }
    }}
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 transition ease-in-out duration-150"
  >
    <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
    </svg>
    Share
  </button>
)

export default Slug
