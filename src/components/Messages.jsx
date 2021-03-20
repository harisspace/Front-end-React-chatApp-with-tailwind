import React from "react"

function Messages() {
  return (
    <>
      <div className="max-h-fluid overflow-y-scroll relative">
        <span className="block">hello</span>
      </div>
      <div className="relative bottom-0 w-full">
        <input
          type="text"
          className="input"
          placeholder="typing the messages.."
        />
      </div>
    </>
  )
}

export default Messages
