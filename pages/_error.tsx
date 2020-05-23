const Error = ({ statusCode }) => (
  <div className="h-full flex justify-center items-center px-4 sm:px-6 lg:px-8">
    <span className="text-gray-600 text-center">
      <h1 className="text-4xl font-black">{statusCode}</h1>
      <p className="text-lg font-medium">An unexpected error has occurred</p>
    </span>
  </div>
)

export async function getServerSideProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { props: { statusCode } }
}

export default Error
