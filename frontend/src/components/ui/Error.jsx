
// eslint-disable-next-line react/prop-types
const Error = ({error}) => {
  return (
    <div className="alert alert-danger my-5" role="alert">
    {error}
    </div>
  )
}

export default Error