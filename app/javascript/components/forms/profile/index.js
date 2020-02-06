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
      subsector:
          myGfw.data.subsector && myGfw.data.subsector.includes('Other')
            ? // From `Other: ${subsector_otherInput}` -> 'Other_(write_in):' (value)
            'Other_(write_in):'
            : myGfw.data.subsector,
      subsector_otherInput:
          myGfw.data.subsector && myGfw.data.subsector.includes('Other')
            ? myGfw.data.subsector.split('Other:')[1].trim()
            : null,
      signUpNewsletterOrTesting: compact([
        myGfw.data.signUpForTesting ? 'testing' : false,
        myGfw.data.signUpForNewsletter ? 'newsletter' : false
      ])
    }
  })
});

export default connect(mapStateToProps, actions)(Component);
