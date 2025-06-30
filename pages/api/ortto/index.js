import axios from 'axios';
import { ORTTO_REQUESTS_TYPES } from './constants';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  const {
    email,
    first_name,
    last_name,
    organization,
    job_title,
    job_function,
    sector,
    city,
    country,
    preferred_language,
    interests,
    receive_updates,
    old_email,
    message,
    tool,
    topic,
    source,
  } = req.body;

  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;

  const INTERESTS = [
    'general_information_data_about_forests',
    'fires',
    'climate_and_carbon',
    'agricultural_supply_chains',
    'forest_watcher_mobile_app',
    'small_grants_fund_and_tech_fellowship',
    'innovations_in_monitoring',
    'biodiversity',
    'landscape_restoration',
    'gfw_users_in_action',
    'places_to_watch_alerts',
    'deforestation',
  ];

  const formData = new FormData();

  formData.append('email', email);
  formData.append('first_name', first_name);
  formData.append('last_name', last_name);
  formData.append('ip_addr', ip);

  let filteredInterests;

  switch (source) {
    case ORTTO_REQUESTS_TYPES.MY_GFW_PROFILE_FORM:
      filteredInterests = interests
        .split(',')
        .filter((item) => INTERESTS.includes(item.toLowerCase()));

      formData.append('old_email', old_email);
      formData.append('organization', organization);
      formData.append('job_title', job_title);
      formData.append('job_function', job_function);
      formData.append('sector', sector);
      formData.append('city', city);
      formData.append('country', country);
      formData.append('preferred_language', preferred_language);
      formData.append('interests', filteredInterests.join());
      formData.append('receive_updates', receive_updates);
      formData.append('form_name', 'GFW My Profile Update');
      break;
    case ORTTO_REQUESTS_TYPES.CONTACT_US_FORM:
      formData.append('message', message);
      formData.append('tool', tool);
      formData.append('topic', topic);
      formData.append('receive_updates', receive_updates);
      formData.append('website', 'globalforestwatch.org');
      formData.append('form_name', 'GFW Contact Us Form');
      break;
    case ORTTO_REQUESTS_TYPES.SUBSCRIBE_FORM:
      formData.append('job_title', job_title);
      formData.append('organization', organization);
      formData.append('sector', sector);
      formData.append('city', city);
      formData.append('country', country);
      formData.append('preferred_language', preferred_language);
      formData.append('interests', filteredInterests.join());
      formData.append('form_name', 'GFW Deforestation');
      break;
    default:
      // return error
      return res.status(400).end();
  }

  try {
    await axios.post('https://ortto.wri.org/custom-forms/gfw/', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });

    return res.status(201).end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).end();
  }
};
