import axios from 'axios';

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

  const filteredInterests = interests
    .split(',')
    .filter((item) => INTERESTS.includes(item.toLowerCase()));

  const formData = new FormData();

  formData.append('email', email);
  formData.append('old_email', old_email);
  formData.append('first_name', first_name);
  formData.append('last_name', last_name);
  formData.append('organization', organization);
  formData.append('job_title', job_title);
  formData.append('job_function', job_function);
  formData.append('sector', sector);
  formData.append('city', city);
  formData.append('country', country);
  formData.append('preferred_language', preferred_language);
  formData.append('interests', filteredInterests.join());
  formData.append('receive_updates', receive_updates);
  formData.append('ip_addr', ip);
  formData.append('form_name', 'GFW My Profile Update');

  try {
    await axios.post('https://ortto.wri.org/custom-forms/gfw/', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400);
  }

  return res.status(201);
};
