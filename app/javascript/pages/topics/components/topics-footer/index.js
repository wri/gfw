import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import Component from './component';

const mapStateToProps = ({ countryData }) => ({
  countries: countryData && countryData.countries
});

export default connect(mapStateToProps, { setModalContactUsOpen })(Component);
