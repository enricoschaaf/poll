export const Checkbox = ({ id, name, register }) => (
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
