import { connect } from 'react-redux';

import { setContactUsModalOpen } from 'components/modals/contact-us/actions';

import Component from './component';

const mapStateToProps = ({ countryData }) => ({
  countries: countryData && countryData.countries,
});

export default connect(mapStateToProps, { setContactUsModalOpen })(Component);
