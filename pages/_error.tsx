import Error from "components/Error"

const CustomError = statusCode => <Error statusCode={statusCode} />

export async function getServerSideProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { props: { statusCode } }
}

export default CustomError
