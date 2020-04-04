import { PureComponent } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { CARTO_API } from 'utils/constants';

import ConfirmationMessage from 'components/confirmation-message';
import Layout from 'layouts/page';

class DashboardsPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    notFound: PropTypes.bool,
  };

  static async getInitialProps({ query, title, description }) {
    const { adm0 } = query;
    const countryData = await axios.get(
      `${CARTO_API}/sql?q=SELECT iso, name_engli as name FROM gadm36_countries WHERE iso = '${adm0}'`
    );
    const country = countryData?.data?.rows?.[0]?.name;

    return {
      title:
        title &&
        title.replace('{locationName}', country || 'Country not found'),
      description:
        country && description
          ? description.replace('{locationName}', country)
          : 'Country not found',
      notFound: !country,
    };
  }

  render() {
    const { notFound } = this.props;

    return (
      <Layout {...this.props}>
        {notFound && (
          <ConfirmationMessage
            className="error-msg"
            title="Country not found"
            description="There is no country available at this url"
            error
          />
        )}
        {!notFound && this.props.title}
      </Layout>
    );
  }
}

export default connect()(DashboardsPage);
