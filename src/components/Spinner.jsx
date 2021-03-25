import React from "react"
import loader from "../assets/loader.svg"

function Spinner() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img
        className="animate-spin duration-100 ease-linear w-2/12"
        src={loader}
        alt="loader"
      />
    </div>
  )
}

export default Spinner
