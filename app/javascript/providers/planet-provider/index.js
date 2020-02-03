import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ planet }) => ({
  data: planet && planet.data
});

class PlanetBasemapsProvider extends PureComponent {
  componentDidMount() {
    const { getPlanetBasemaps, data } = this.props;
    if (isEmpty(data)) {
      getPlanetBasemaps();
    }
  }

  render() {
    return null;
  }
}

PlanetBasemapsProvider.propTypes = {
  data: PropTypes.array,
  getPlanetBasemaps: PropTypes.func.isRequired
};

reducerRegistry.registerModule('planet', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(PlanetBasemapsProvider);
