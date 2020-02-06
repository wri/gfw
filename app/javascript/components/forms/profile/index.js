import { connect } from 'react-redux';
import compact from 'lodash/compact';

import Component from './component';
import * as actions from './actions';

const mapStateToProps = ({ myGfw, countryData }) => ({
  countries: countryData && countryData.countries,
  ...(myGfw &&
    myGfw.data && {
    initialValues: {
      ...myGfw.data,
      signUpNewsletterOrTesting: compact([
        myGfw.data.signUpForTesting ? 'testing' : false,
        myGfw.data.signUpForNewsletter ? 'newsletter' : false
      ])
    }
  })
});

export default connect(mapStateToProps, actions)(Component);
