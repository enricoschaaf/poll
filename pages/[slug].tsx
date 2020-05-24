import { useFetch } from "hooks/useFetch"
import Head from "next/head"
import { useRouter } from "next/router"

async function handleSubmit(e) {
  e.persist()
  e.preventDefault()
  const data = {}
  await fetch("/api/vote", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data)
  })
  e.target.reset()
}

const Slug = () => {
  const router = useRouter()
  const { data } = useFetch(
    router.query.slug && `/api/get/${router.query.slug}`
  )
  if (data) {
    return (
      <>
        <Head>
          <title>{data?.title ?? "Poll"}</title>
        </Head>
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white overflow-hidden shadow rounded-lg w-full"
          >
            <div className="px-4 py-5 sm:p-6 grid gap-4 sm:gap-6 lg:gap-8">
              <h1 className="text-gray-700">{data.title}</h1>
              {data.allowMultipleOptions
                ? data.options.map(({ id, name }) => (
                    <Checkbox key={id} name={name} />
                  ))
                : data.options.map(({ id, name }) => (
                    <Radio key={id} name={name} />
                  ))}
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 space-x-4 sm:space-x-6 lg:space-x-8 flex justify-end">
              <VoteButton />
              <ShowResultButton />
            </div>
          </form>
        </div>
      </>
    )
  }
  return null
}

const Checkbox = ({ name }) => (
  <div className="mt-4">
    <div className="relative flex items-start">
      <div className="absolute flex items-center h-5">
        <input
          id={name}
          type="checkbox"
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
      </div>
      <label
        htmlFor={name}
        className="pl-7 text-sm leading-5 font-medium text-gray-500"
      >
        {name}
      </label>
    </div>
  </div>
)

const Radio = ({ name }) => (
  <div className="mt-4 flex items-center">
    <input
      id={name}
      name="option"
      type="radio"
      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
    />
    <label htmlFor={name} className="ml-3">
      <span className="block text-sm leading-5 font-medium text-gray-500">
        {name}
      </span>
    </label>
  </div>
)

const VoteButton = () => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="submit"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
    >
      Vote
    </button>
  </span>
)

const ShowResultButton = () => (
  <span className="inline-flex rounded-md shadow-sm">
    <button className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 hover:border-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-blue active:text-indigo-700 active:bg-indigo-50 transition ease-in-out duration-150">
      Show result
    </button>
  </span>
)

export default Slug
