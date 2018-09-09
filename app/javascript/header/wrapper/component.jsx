import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import MyGFWProvider from 'providers/mygfw-provider';

class App extends PureComponent {
  render() {
    const { loggedIn } = this.props;
    return (
      <Fragment>
        <Header loggedIn={loggedIn} />
        <MyGFWProvider />
      </Fragment>
    );
  }
}

App.propTypes = {
  loggedIn: PropTypes.bool
};

export default App;
