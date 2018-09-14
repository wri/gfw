import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MAP } from 'router';
import { getLocationFromData } from 'utils/format';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const mapDispatchToProps = (dispatch, { query }) => {
  let newQuery = {};
  if (query) {
    newQuery = {
      ...query,
      map: {
        ...(query.map && query.map),
        canBound: true
      }
    };
  }

  return bindActionCreators(
    {
      handleAnalyze: interaction => {
        const { data = {} } = interaction;
        const newLocation = data && getLocationFromData(data);
        return {
          type: MAP,
          payload: {
            type: 'country',
            ...newLocation
          },
          query: newQuery
        };
      },
      ...actions
    },
    dispatch
  );
};

export const reduxModule = { actions, reducers, initialState };

export default connect(getPopupProps, mapDispatchToProps)(Component);
