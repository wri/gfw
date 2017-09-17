import { createAction } from 'redux-actions';

const setIsLoading = createAction('setIsLoading');
const setValues = createAction('setValues');

export default {
  setIsLoading,
  setValues
};
