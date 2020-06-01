import { motion } from "framer-motion"

export const Radio = ({ id, name, register }) => (
  <div className="flex items-center">
    <motion.input
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
