import axios from 'axios';
import { getCountriesProvider } from 'services/country';

export default async (req, res) => {
  // get countries
  const countries = await getCountriesProvider();
  console.log('countries: ', countries);

  try {
    const path = req.query.params.join('/');
    const url = `https://downloadsitegfw/tcl/${path}/`;
    const response = await axios.get(url);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
