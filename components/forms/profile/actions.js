import { createThunkAction } from 'redux/actions';
import axios from 'axios';
import { FORM_ERROR } from 'final-form';

import { updateProfile, createProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

const saveOrttoProfile = async (data) => {
  const payload = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    organization: data.applicationData.gfw.company,
    job_title: data.applicationData.gfw.jobTitle,
    job_function: data.applicationData.gfw.subsector,
    sector: data.applicationData.gfw.sector,
    city: data.applicationData.gfw.city,
    country: data.applicationData.gfw.country,
    preferred_language: data.applicationData.gfw.preferred_language,
    interests: data.applicationData.gfw.interests.toString(),
  };

  try {
    await axios.post('https://ortto.wri.org/custom-forms/gfw/', payload);
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
          // if isUserProfileFilled and receive_updates is true, send POST
          if (postData.applicationData.gfw.receive_updates) {
            saveOrttoProfile(postData);
          }

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
