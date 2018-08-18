export const initialState = {
  showPanel: true,
  showMyGfw: false,
  showLangSelector: false,
  isLoggedIn: false
};

const setShowPanel = (state, { payload }) => ({
  ...state,
  showPanel: payload,
  showMyGfw: false,
  showLangSelector: false
});

const setShowMyGfw = (state, { payload }) => ({
  ...state,
  showMyGfw: payload,
  showPanel: false,
  showLangSelector: false
});

const setLangSelector = (state, { payload }) => ({
  ...state,
  showLangSelector: payload,
  showPanel: false,
  showMyGfw: false
});

export default {
  setShowPanel,
  setShowMyGfw,
  setLangSelector
};
