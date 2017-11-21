export function setUserData(data) {
  return {
    type: 'SET_USER_DATA',
    data
  }
}

export function setUserGroup(group) {
  return {
    type: 'SET_USER_GROUP',
    group
  }
}

export function showModal() {
  return {
    type: 'SHOW_MODAL'
  }
}

export function hideModal() {
  return {
    type: 'HIDE_MODAL'
  }
}
