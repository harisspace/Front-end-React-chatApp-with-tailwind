import React, { createContext, useReducer } from "react"

import { selectedUserReducer } from "../reducers/selectUserReducer"

export const SelectedUserContext = createContext({
  selectUser: (data) => {},
})

const initialState = {
  selectedUser: null,
}

export default function SelectedUserContextProvider(props) {
  const [state, dispatch] = useReducer(selectedUserReducer, initialState)

  const selectUser = (userId) => {
    dispatch({
      type: "SELECT_USER",
      payload: userId,
    })
  }

  return (
    <SelectedUserContext.Provider
      value={{ selectedUser: state.selectedUser, selectUser }}
    >
      {props.children}
    </SelectedUserContext.Provider>
  )
}
