import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import Home from 'layouts/home';

class HomePage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Layout {...this.props}>
        <Home />
      </Layout>
    );
  }
}

export default connect()(HomePage);
