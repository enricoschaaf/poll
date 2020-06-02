import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import Head from "next/head"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Result } from "./Result"
import { Vote } from "./Vote"

export const Poll = ({ data }) => {
  const { register, handleSubmit, reset } = useForm()
  const [status, setStatus] = useState("success")
  const [active, setActive] = useState("vote")
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

    ;[...e.target].find(({ type }) => type === "checkbox")?.select()
  }
  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <AnimateSharedLayout>
        <motion.div
          animate
          className="bg-white overflow-hidden shadow rounded-lg w-full"
        >
          <motion.div
            animate
            className="flex justify-between p-4 sm:px-6 border-b border-gray-200 items-center"
          >
            <h1 className="text-indigo-600 font-semibold text-lg">
              {data?.title}
            </h1>
            <AnimateSharedLayout>
              <motion.span animate className="grid grid-flow-col col-gap-4">
                <button
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  className={`${
                    active === "vote"
                      ? "text-indigo-700"
                      : "text-gray-500 hover:text-indigo-700"
                  } px-3 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none relative bg-transparent`}
                  onClick={() => setActive("vote")}
                >
                  {active === "vote" && (
                    <motion.div
                      layoutId="backgroundColor"
                      className="bg-indigo-100 absolute top-0 left-0 right-0 bottom-0 rounded-lg"
                    />
                  )}
                  <span className="relative" style={{ userSelect: "none" }}>
                    Vote
                  </span>
                </button>
                <button
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  className={`${
                    active === "result"
                      ? "text-indigo-700"
                      : "text-gray-500 hover:text-indigo-700"
                  } px-3 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none relative bg-transparent`}
                  onClick={() => setActive("result")}
                >
                  {active === "result" && (
                    <motion.div
                      layoutId="backgroundColor"
                      className="bg-indigo-100 absolute top-0 left-0 right-0 bottom-0 rounded-lg "
                    />
                  )}
                  <span className="relative">Result</span>
                </button>
              </motion.span>
            </AnimateSharedLayout>
          </motion.div>
          <form onSubmit={handleSubmit(onSubmit)} id="vote">
            <div className="px-4 py-5 sm:px-6 grid gap-4 sm:gap-6 lg:gap-8">
              <AnimatePresence>
                {active === "vote" ? (
                  <Vote data={data} register={register} />
                ) : (
                  <Result data={data} />
                )}
              </AnimatePresence>
            </div>
          </form>
          <div className="bg-gray-50 p-4 sm:px-6 space-x-4 flex justify-end">
            {active === "vote" && <VoteButton status={status} />}
            <ShareButton title={data?.title} />
          </div>
        </motion.div>
      </AnimateSharedLayout>
    </>
  )
}

const VoteButton = ({ status }) => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="submit"
      form="vote"
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

const ShareButton = ({ title }) => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="button"
      onClick={() => {
        //@ts-ignore
        if (navigator.share) {
          //@ts-ignore
          navigator.share({ title, url: location.href })
        }
      }}
      className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 hover:border-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-blue active:text-indigo-700 active:bg-indigo-50 transition ease-in-out duration-150"
    >
      Share
    </button>
  </span>
)
