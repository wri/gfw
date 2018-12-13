import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMyGfwProps } from './selectors';

class MyGFWProvider extends PureComponent {
  componentWillMount() {
    const { checkLogged } = this.props;
    checkLogged();
  }

  render() {
    return null;
  }
}

MyGFWProvider.propTypes = {
  checkLogged: PropTypes.func.isRequired
};

reducerRegistry.registerModule('myGfw', {
  actions,
  reducers,
  initialState
});

export default connect(getMyGfwProps, actions)(MyGFWProvider);
