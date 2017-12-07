import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import globe from './globe';

const reducers = combineReducers({
  form: reduxFormReducer,
  globe
});

export default reducers;
