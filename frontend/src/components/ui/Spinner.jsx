/* eslint-disable react/prop-types */
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };
  

const Spinner = ({loading}) => {
  return (
    <ClipLoader
        loading={loading}
        cssOverride={override}
        size={450}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
  )
}

export default Spinner



