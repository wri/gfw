import React, { PureComponent, Fragment } from 'react';
import Proptypes from 'prop-types';
import Loader from 'components/ui/loader';
import universal from 'react-universal-component';

import 'styles/styles.scss';

const universalOptions = {
  loading: <Loader />,
  minDelay: 200
};

const PageComponent = universal(
  ({ path } /* webpackChunkName: "[request]" */) =>
    import(`../../${path}/index.js`),
  universalOptions
);

class App extends PureComponent {
  render() {
    const { route } = this.props;
    return (
      <Fragment>
        <PageComponent path={route.component} />
      </Fragment>
    );
  }
}

App.propTypes = {
  route: Proptypes.object.isRequired
};

export default App;
