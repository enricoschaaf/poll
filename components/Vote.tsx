import { Checkbox } from "./Checkbox"
import { Radio } from "./Radio"

export const Vote = ({ data, register }) => {
  return data?.allowMultipleOptions
    ? data.options.map(({ id, name }) => (
        <Checkbox register={register} key={id} id={id} name={name} />
      ))
    : data?.options.map(({ id, name }) => (
        <Radio register={register} key={id} id={id} name={name} />
      ))
}
