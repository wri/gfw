import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

const splitFirstName = fullName => {
  const arr = fullName.split(' ');
  return arr.slice(0, arr.length / 2).join(' ');
};

const splitLastName = fullName => {
  const arr = fullName.split(' ');
  return arr.slice(arr.length / 2, arr.length).join(' ');
};

const mapStateToProps = ({ myGfw, countryData }) => ({
  countries: countryData && countryData.countries,
  ...(myGfw &&
    myGfw.data && {
    initialValues: {
      ...myGfw.data,
      firstName:
          myGfw.data.firstName ||
          (myGfw.data.fullName && splitFirstName(myGfw.data.fullName)),
      lastName:
          myGfw.data.lastName ||
          (myGfw.data.fullName && splitLastName(myGfw.data.fullName)),
      subsector:
          myGfw.data.subsector && myGfw.data.subsector.includes('Other')
            ? // From `Other: ${subsector_otherInput}` -> 'Other:' (value)
            'Other:'
            : myGfw.data.subsector,
      subsector_otherInput:
          myGfw.data.subsector && myGfw.data.subsector.includes('Other')
            ? myGfw.data.subsector.split('Other:')[1].trim()
            : null
    }
  })
});

export default connect(mapStateToProps, actions)(Component);
