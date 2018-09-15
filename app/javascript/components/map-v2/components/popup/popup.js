import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MAP } from 'router';
import { getLocationFromData } from 'utils/format';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleAnalyze: interaction => (_, getState) => {
        const { data = {} } = interaction;
        const newLocation = data && getLocationFromData(data);
        const query = getState().location.query || {};
        dispatch({
          type: MAP,
          payload: {
            type: 'country',
            ...newLocation
          },
          query: {
            ...query,
            map: {
              ...(query && query.map && query.map),
              canBound: true
            },
            analysis: {
              ...(query && query.analysis && query.analysis),
              showAnalysis: true
            }
          }
        });
      },
      ...actions
    },
    dispatch
  );

export const reduxModule = { actions, reducers, initialState };

export default connect(getPopupProps, mapDispatchToProps)(Component);
