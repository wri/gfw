import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

const splitFirstName = (fullName) => {
  const arr = fullName.split(' ');
  return arr.slice(0, arr.length / 2).join(' ');
};

const splitLastName = (fullName) => {
  const arr = fullName.split(' ');
  return arr.slice(arr.length / 2, arr.length).join(' ');
};

const mapStateToProps = ({ myGfw, countryData }) => {
  const { howDoYouUse, subsector } = myGfw.data || {};

  const subsectorHasOther = subsector && subsector.includes('Other');
  const subsectorSplit = subsectorHasOther && subsector.split('Other:');
  const subsectorOther = subsectorSplit && subsectorSplit.length >= 2 ? subsectorSplit[1].trim() : null;

  const howDoYouUseHasOther = howDoYouUse && howDoYouUse.some(el => el.includes('Other'));
  const howDoYouUseOtherEntry = howDoYouUseHasOther && howDoYouUse.find(el => el.includes('Other'));
  const howDoYouUseSplit = howDoYouUseOtherEntry && howDoYouUseOtherEntry.split('Other:');
  const howDoYouUseOther = howDoYouUseSplit && howDoYouUseSplit.length >= 2 ? howDoYouUseSplit[1].trim() : null;

  return {
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
        subsector_otherInput: subsectorOther,
        howDoYouUse:
            myGfw.data.howDoYouUse &&
            myGfw.data.howDoYouUse.some(el => el.includes('Other'))
              ? [
                ...myGfw.data.howDoYouUse.filter(use => !use.includes('Other')),
                'Other'
              ]
              : myGfw.data.howDoYouUse,
        howDoYouUse_otherInput: howDoYouUseOther
      }
    })
  };
};

export default connect(mapStateToProps, actions)(Component);
