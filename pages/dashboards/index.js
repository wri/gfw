import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Layout from 'layouts/page';

class DashboardsPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Layout {...this.props}>
        <h1>{this.props.title}</h1>
      </Layout>
    );
  }
}

export default DashboardsPage;
