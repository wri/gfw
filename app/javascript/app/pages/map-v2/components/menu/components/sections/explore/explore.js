import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MAPV2 } from 'router';

import * as actions from 'pages/map-v2/components/menu/menu-actions';
import { mapStateToProps } from './explore-selectors';

import ExploreComponent from './explore-component';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleViewOnMap: payload => {
        const { map, route, query } = payload;
        return {
          type: MAPV2,
          payload: {
            ...route
          },
          query: {
            ...query,
            ...(query &&
              query.map && {
                map: {
                  ...query.map,
                  ...map,
                  canBound: true
                }
              })
          }
        };
      },
      ...actions
    },
    dispatch
  );

class ExploreContainer extends PureComponent {
  render() {
    return createElement(ExploreComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreContainer);
