import { useEffect, useState } from "react"

export function useFetch(url: string, init = null) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("success")

  useEffect(() => {
    if (url) {
      setStatus("loading")
      fetch(url, init)
        .then(res => res.json())
        .then(({ data }) => {
          setData(data)
          setStatus("success")
        })
    }
  }, [init, url])

  return { status, data }
}
