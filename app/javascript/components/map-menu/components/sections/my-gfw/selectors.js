import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const selectLoading = state => state.mapMenu && state.mapMenu.loading;
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const areas = state => state.areas && state.areas.data;

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  areas
});
