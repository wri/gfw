import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MAP } from 'pages/map-v2/router';

import * as actions from 'pages/map-v2/menu/menu-actions';
import { mapStateToProps } from './explore-selectors';

import ExploreComponent from './explore-component';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleViewOnMap: payload => {
        const { map, route, query } = payload;
        return {
          type: MAP,
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
