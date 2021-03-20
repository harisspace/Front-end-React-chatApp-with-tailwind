export const selectedUserReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_USER":
      return {
        ...state,
        selectedUser: action.payload,
      }
    default:
      return state
  }
}
