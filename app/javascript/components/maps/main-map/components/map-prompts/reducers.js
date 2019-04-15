import * as actions from './actions';

const mapPrompts = JSON.parse(localStorage.getItem('mapPrompts'));

export const initialState = {
  data: {
    showPrompts: true,
    promptsViewed: [],
    ...mapPrompts
  },
  settings: {
    open: false,
    stepIndex: 0,
    stepsKey: ''
  }
};

const setShowMapPrompts = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    showPrompts: payload
  }
});

export default {
  [actions.setShowMapPrompts]: setShowMapPrompts
};
