import { useFetch } from "hooks/useFetch"
import Head from "next/head"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const Slug = () => {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data, e) => {
    if (data?.option) {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      return reset()
    }
    if (Object.entries(data).find(([, value]) => value == true)) {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      return reset()
    }

    ;[...e.target].find(({ type }) => type === "checkbox").select()
  }
  const { data } = useFetch(
    router.query.slug && `/api/get/${router.query.slug}`
  )
  if (data) {
    return (
      <>
        <Head>
          <title>{data?.title ?? "Poll"}</title>
        </Head>
        <div className="flex-grow p-4 sm:p-6 lg:p-8 flex">
          <div className="max-w-3xl mx-auto flex-grow flex justify-center items-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white overflow-hidden shadow rounded-lg w-full"
            >
              <div className="px-4 py-5 sm:p-6 grid gap-4 sm:gap-6 lg:gap-8">
                <h1 className="text-indigo-600 font-semibold text-lg">
                  {data.title}
                </h1>
                {data.allowMultipleOptions
                  ? data.options.map(({ id, name }) => (
                      <Checkbox
                        register={register}
                        key={id}
                        id={id}
                        name={name}
                      />
                    ))
                  : data.options.map(({ id, name }) => (
                      <Radio register={register} key={id} id={id} name={name} />
                    ))}
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 space-x-4 sm:space-x-6 lg:space-x-8 flex justify-end">
                <VoteButton />
                <ShowResultButton />
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }
  return null
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
