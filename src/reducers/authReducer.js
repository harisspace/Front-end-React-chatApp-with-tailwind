export function authReducer(state, action) {
   switch(action.type) {
      case 'LOGINORREGISTER':
         return {
            ...state,
            user: action.payload
         }
      case 'LOGOUT':
         return {
            ...state,
            user: null
         }
      default:
         return state
   }
}