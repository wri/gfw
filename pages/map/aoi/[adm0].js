import { PureComponent } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { CARTO_API } from 'utils/constants';

import Layout from 'layouts/page';

class DashboardsPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  static async getInitialProps({ query }) {
    const { location } = query;
    // const countryName = await axios.get(`${CARTO_API}/sql?q=SELECT iso, name_engli as name FROM gadm36_countries WHERE iso = '${location[1]}' AND iso != 'XCA' AND iso != 'TWN'`)

    // const { rows } = countryName.data;

    // return {
    //   title: `${rows && rows[0] ? rows[0].name : location[0]} dashboard`
    // }
  }

  render() {
    return (
      <Layout {...this.props}>
        {this.props.title}
      </Layout>
    );
  }
}

export default connect()(DashboardsPage);
