import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MAP } from 'router';
import { parseGadm36Id } from 'utils/format';

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
        let location = {};
        if (data.level && data.gid_0) {
          location = data.level ? parseGadm36Id(data[`gid_${data.level}`]) : {};
        }
        return {
          type: MAP,
          payload: {
            type: 'country',
            country: !!location.adm0 && location.adm0,
            region: !!location.adm1 && location.adm1,
            subRegion: !!location.adm2 && location.adm2
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
