import { createThunkAction } from 'redux/actions';
import { FORM_ERROR } from 'final-form';

import { updateProfile, createProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

export const saveProfile = createThunkAction(
  'saveProfile',
  (fields) => (dispatch) => {
    const {
      id,
      signUpForNewsletter,
      subsector,
      subsector_otherInput,
      howDoYouUse,
      howDoYouUse_otherInput,
      firstName,
      lastName,
      email,
      country,
      city,
      state,
      sector,
      company,
      interests,
      topics,
      aoiCountry,
      areaOrRegionOfInterest,
      jobTitle,
      signUpForTesting,
      isUserProfileFilled,
    } = fields;

    const postData = {
      firstName,
      lastName,
      email,
      applicationData: {
        gfw: {
          country,
          city,
          state,
          sector,
          company,
          interests,
          topics,
          aoiCountry,
          jobTitle,
          areaOrRegionOfInterest,
          subsector:
            subsector && subsector.includes('Other')
              ? `Other: ${subsector_otherInput || ''}`
              : subsector,
          howDoYouUse:
            howDoYouUse && howDoYouUse.includes('Other')
              ? [
                  ...howDoYouUse.filter((use) => use !== 'Other'),
                  `Other: ${howDoYouUse_otherInput || ''}`,
                ]
              : howDoYouUse,
          signUpForNewsletter:
            !!signUpForNewsletter &&
            signUpForNewsletter.length &&
            signUpForNewsletter.includes('newsletter')
              ? 'true'
              : false,
          signUpForTesting: signUpForTesting ? 'true' : false,
        },
      },
    };

    const updateOrCreate = isUserProfileFilled ? updateProfile : createProfile;

    return updateOrCreate(id, postData)
      .then((response) => {
        if (response.data && response.data.data) {
          const { attributes } = response.data.data;
          dispatch(
            setMyGFW({
              loggedIn: true,
              id: response.data.data.id,
              isUserProfileFilled: true,
              ...attributes,
              ...attributes.applicationData.gfw,
            })
          );
        }

        return true;
      })
      .catch((error) => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail,
        };
      });
  }
);
