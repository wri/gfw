import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { withRouter } from 'react-router';

import actions from './globe-actions';
import reducers, { initialState } from './globe-reducers';

import GlobeComponent from './globe-component';
// import { globeSelector } from './globe-selectors';

const mapStateToProps = state => ({
  state
});

class GlobeContainer extends PureComponent {
  render() {
    return createElement(GlobeComponent, {
      ...this.props
    });
  }
}

GlobeContainer.propTypes = {};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(GlobeContainer);
