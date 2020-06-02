import { useRouter } from "next/router"
import useSWR from "swr"

export const Result = ({ data: initalData }) => {
  const {
    query: { slug }
  } = useRouter()
  const { data } = useSWR(`/api/result/${slug}`, {
    fetcher: url => fetch(url).then(res => res.json()),
    refreshInterval: 1
  })
  return (
    <>
      {data?.options.map(({ id, name, votes }) => (
        <div
          className="flex justify-between text-sm leading-5 font-medium text-gray-500"
          key={id}
        >
          <span>{name}</span>
          <span>{votes}</span>
        </div>
      )) ??
        initalData.options.map(name, index => (
          <div
            className="flex justify-between text-sm leading-5 font-medium text-gray-500"
            key={index}
          >
            <span>{name}</span>
            <span>0</span>
          </div>
        ))}
    </>
  )
}
