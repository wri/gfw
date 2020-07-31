import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

const splitFirstName = fullName => {
  const arr = fullName && fullName.split(' ');
  return arr && arr.length > 1 ? arr.slice(0, arr.length / 2).join(' ') : fullName;
};

const splitLastName = fullName => {
  const arr = fullName && fullName.split(' ');
  return arr && arr.length > 1 ? arr.slice(arr.length / 2, arr.length).join(' ') : fullName;
};

const mapStateToProps = ({ myGfw, countryData }) => {
  const { howDoYouUse, subsector, firstName, fullName, lastName } = myGfw.data || {};

  const subsectorHasOther = subsector && subsector.includes('Other');
  const subsectorSplit = subsectorHasOther && subsector.split('Other:');
  const subsectorOther = subsectorSplit && subsectorSplit.length >= 2 ? subsectorSplit[1].trim() : null;

  const howDoYouUseOtherEntry = howDoYouUse && howDoYouUse.find(el => el.includes('Other'));
  const howDoYouUseSplit = howDoYouUseOtherEntry && howDoYouUseOtherEntry.split('Other:');
  const howDoYouUseOther = howDoYouUseSplit && howDoYouUseSplit.length >= 2 ? howDoYouUseSplit[1].trim() : null;



  return {
    countries: countryData && countryData.countries,
    ...(myGfw &&
      myGfw.data && {
      initialValues: {
        ...myGfw.data,
        firstName:
          firstName ||
            (fullName && splitFirstName(fullName)),
        lastName:
          lastName ||
            (fullName && splitLastName(fullName)),
        subsector:
          subsectorOther
            ?
            'Other:'
            : subsector,
        subsector_otherInput: subsectorOther,
        howDoYouUse:
          howDoYouUseOther
            ? [
              ...howDoYouUse && howDoYouUse.filter(use => !use.includes('Other')),
              'Other'
            ]
            : howDoYouUse,
        howDoYouUse_otherInput: howDoYouUseOther
      }
    })
  };
};

export default connect(mapStateToProps, actions)(Component);
