import { AnimateSharedLayout, motion } from "framer-motion"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

const initalState = [nanoid(), nanoid(), nanoid()]

export const Form = () => {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm()
  const [status, setStatus] = useState("success")
  const onSubmit = async (data, e) => {
    const options = Object.entries(data).filter(
      ([id, value]: [string, string]) =>
        id.startsWith("option-") && value !== ""
    )
    if (options.length > 1) {
      setStatus("loading")
      const res = await fetch("/api/create", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          options: options.map(([, value]) => value),
          allowMultipleOptions: data.allowMultipleOptions
        })
      })
      const {
        data: { slug }
      } = await res.json()
      router.push("/[slug]", `/${slug}`)
      reset()
      setStatus("success")
    } else if (options.length === 0) {
      ;[...e.target].find(({ name }) => name.startsWith("option-")).select()
    } else {
      ;[...e.target]
        .find(({ name, value }) => name.startsWith("option-") && value === "")
        .select()
    }
  }
  const [options, setOptions] = useState(initalState)

  return (
    <AnimateSharedLayout>
      <motion.form
        animate
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white overflow-hidden shadow rounded-lg w-full"
      >
        <div className="px-4 py-5 sm:p-6 grid gap-4 sm:gap-6 lg:gap-8">
          <Title register={register} />
          {options.map((id, index) => (
            <Option
              register={register}
              id={id}
              key={id}
              index={index}
              options={options}
              setOptions={setOptions}
            />
          ))}
          <Checkbox register={register} />
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 space-x-4 flex justify-end">
          <SubmitButton status={status} />
          <ResetButton setOptions={setOptions} />
        </div>
      </motion.form>
    </AnimateSharedLayout>
  )
}

const Option = ({ id, index, options, setOptions, register }) => (
  <>
    <label htmlFor={`option-${id}`} className="sr-only">
      Option
    </label>
    <div className="relative rounded-md shadow-sm">
      <input
        id={`option-${id}`}
        className="form-input block w-full sm:text-sm sm:leading-5"
        placeholder={`Option ${index + 1}`}
        autoComplete="off"
        ref={register}
        name={`option-${id}`}
        onInput={() => {
          if (index === options.length - 1) {
            setOptions(previousOptions => [...previousOptions, nanoid()])
          }
        }}
      />
    </div>
  </>
)

const Title = ({ register }) => (
  <>
    <label htmlFor="title" className="sr-only">
      Title
    </label>
    <div className="relative rounded-md shadow-sm">
      <motion.input
        id="title"
        name="title"
        ref={register({ required: true })}
        className="form-input block w-full sm:text-sm sm:leading-5"
        placeholder="Title"
        autoComplete="off"
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
      className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 hover:border-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-blue active:text-indigo-700 active:bg-indigo-50 transition ease-in-out duration-150"
    >
      Reset poll
    </button>
  </span>
)

const Checkbox = ({ register }) => (
  <div className="relative flex items-start">
    <div className="absolute flex items-center h-5">
      <motion.input
        id="allowMultipleOptions"
        name="allowMultipleOptions"
        type="checkbox"
        ref={register}
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
