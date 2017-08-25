const globe = (state = {}, action = null) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return Object.assign({}, state, {
        userData: action.data
      });
    case 'SET_USER_GROUP':
      return Object.assign({}, state, {
        userGroup: action.group
      });
    case 'SHOW_MODAL':
      return Object.assign({}, state, {
        isVisible: true
      });
    case 'HIDE_MODAL':
      return Object.assign({}, state, {
        isVisible: false
      });
    default:
      return state
  }
};

export default globe;
