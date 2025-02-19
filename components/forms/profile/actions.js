import { createThunkAction } from 'redux/actions';
import axios from 'axios';
import { FORM_ERROR } from 'final-form';

import { updateProfile, createProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

const saveOrttoProfile = async (payload) => {
  try {
    await axios.post('/api/ortto', payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

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
      old_email,
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
      receive_updates = false,
      preferred_language = 'en',
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
          receive_updates,
          preferred_language,
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
      .then(async (response) => {
        if (response.data && response.data.data) {
          saveOrttoProfile({
            email,
            first_name: firstName,
            last_name: lastName,
            organization: company,
            job_title: jobTitle,
            job_function:
              subsector && subsector.includes('Other')
                ? `Other: ${subsector_otherInput || ''}`
                : subsector,
            sector,
            city,
            country,
            preferred_language,
            interests: interests.toString(),
            receive_updates,
            old_email,
          });

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
