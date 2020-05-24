import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import { useState } from "react"

const initalState = [nanoid(), nanoid(), nanoid()]

export const Form = () => {
  const router = useRouter()
  const [status, setStatus] = useState("success")
  const [options, setOptions] = useState(initalState)

  async function handleSubmit(e) {
    e.persist()
    e.preventDefault()
    setStatus("loading")
    const data = {
      title: [...e.target].find(({ id }) => id === "title").value,
      options: [...e.target]
        .filter(({ id, value }) => id.includes("option-") && value !== "")
        .map(({ value }) => value),
      allowMultipleOptions: [...e.target].find(
        ({ id }) => id === "allowMultipleOptions"
      ).checked
    }
    const res = await fetch("/api/create", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data)
    })
    const {
      data: { slug }
    } = await res.json()
    e.target.reset()
    router.push(`/${slug}`)
    setStatus("success")
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white overflow-hidden shadow rounded-lg w-full"
      >
        <div className="px-4 py-5 sm:p-6 grid gap-4 sm:gap-6 lg:gap-8">
          <Title />
          {options.map((id, index) => (
            <Option
              id={id}
              key={id}
              index={index}
              options={options}
              setOptions={setOptions}
            />
          ))}
          <Checkbox />
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 space-x-4 sm:space-x-6 lg:space-x-8 flex justify-end">
          <SubmitButton status={status} />
          <ResetButton setOptions={setOptions} />
        </div>
      </form>
    </div>
  )
}

const Option = ({ id, index, options, setOptions }) => (
  <div className="overflow-hidden">
    <label htmlFor={`option-${id}`} className="sr-only">
      Option
    </label>
    <div className="relative rounded-md shadow-sm">
      <input
        id={`option-${id}`}
        className="form-input block w-full sm:text-sm sm:leading-5"
        placeholder={`Option ${index + 1}`}
        autoComplete="off"
        onInput={() => {
          if (index === options.length - 1) {
            setOptions(previousOptions => [...previousOptions, nanoid()])
          }
        }}
      />
    </div>
  </div>
)

const Title = () => (
  <>
    <label htmlFor="title" className="sr-only">
      Title
    </label>
    <div className="relative rounded-md shadow-sm">
      <input
        id="title"
        className="form-input block w-full sm:text-sm sm:leading-5"
        placeholder="Title"
        autoComplete="off"
        required
      />
    </div>
  </>
)

const SubmitButton = ({ status }) => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="submit"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 w-28 justify-center"
    >
      {status === "success"
        ? "Create poll"
        : status === "loading" && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          )}
    </button>
  </span>
)

const ResetButton = ({ setOptions }) => (
  <span className="inline-flex rounded-md shadow-sm">
    <button
      type="reset"
      onClick={() => setOptions(initalState)}
      className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 hover:border-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-blue active:text-indigo-700 active:bg-indigo-50 transition ease-in-out duration-150 w-28 justify-center"
    >
      Reset poll
    </button>
  </span>
)

const Checkbox = () => (
  <div className="relative flex items-start">
    <div className="absolute flex items-center h-5">
      <input
        id="allowMultipleOptions"
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
      />
    </div>
    <label
      htmlFor="allowMultipleOptions"
      className="pl-7 text-sm leading-5 font-medium text-gray-500"
    >
      Allow multiple options
    </label>
  </div>
)
