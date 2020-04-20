import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import Map from 'layouts/map';

class MapPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Layout {...this.props}>
        <Map />
      </Layout>
    );
  }
}

export default MapPage;
