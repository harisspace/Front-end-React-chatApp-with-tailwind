export function messageReducer(state, action) {
  switch (action.type) {
    case "NEW_MESSAGES":
      return [...action.payload]
    case "NEW_MESSAGE":
      return [...state, action.payload]
    default:
      return state
  }
}
