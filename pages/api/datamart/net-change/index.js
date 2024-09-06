import { dataMartRequest } from 'utils/request';

const get_net_tree_cover_change_results = async (iso, adm1, adm2) => {
  const paramStr = `?iso=${iso}${adm1 ? `&adm1=${adm1}` : ''}${
    adm2 ? `&adm2=${adm2}` : ''
  }`;
  const url = `/datamart/analysis/forest_change/tree_cover_change/net_tree_cover_change${paramStr}`;
  // console.info(`Data Mart Request: ${url}`);
  const response = await dataMartRequest.get(url);

  return [response?.data];
};

const get_net_tree_cover_change_download_url = async (adm0, adm1, adm2) => {
  // checks
  if (adm1 === undefined && adm2 !== undefined) {
    throw new Error('if adm2 is present, adm1 can not be empty');
  }

  if (!adm0 && (adm1 || adm2)) {
    throw new Error('if adm1 or adm2 are present, adm0 can not be empty');
  }

  let url = '/dataset';
  const fieldsList = [
    'iso',
    'stable',
    'loss',
    'gain',
    'disturb',
    'net',
    'change',
    'gfw_area__ha',
  ];
  let where = ``;
  /*
    possible datasets based on the adm lvl:
    umd_adm0_net_tree_cover_change_from_height --> for iso and adm0
    umd_adm1_net_tree_cover_change_from_height --> for adm1
    umd_adm2_net_tree_cover_change_from_height --> for adm2

    1. if iso and adm1 and adm2 are not present, then its global, therefore use umd_adm0_net_tree_cover_change_from_height
    2. if adm2 is present then use umd_adm2_net_tree_cover_change_from_height
    3. if only iso and adm1 are present then use umd_adm1_net_tree_cover_change_from_height
    "params": {
      "iso": "MEX",
      "adm1": "9",
      "adm2": "3",
      "download": "false"
    }
  */
  let dataset = 'umd_adm0_net_tree_cover_change_from_height';

  if (adm0 !== '') {
    where = `WHERE iso='${adm0}'`;
  }

  if (adm1 !== '' && adm2 === '') {
    dataset = 'umd_adm1_net_tree_cover_change_from_height';
    where = `${where} AND adm1='${adm1}'`;
    fieldsList.push('adm1');
    fieldsList.push('adm1_name');
  }

  if (adm1 !== '' && adm2 !== '') {
    dataset = 'umd_adm2_net_tree_cover_change_from_height';
    where = `${where} AND adm1='${adm1}' AND adm2='${adm2}'`;
    fieldsList.push('adm1');
    fieldsList.push('adm1_name');
    fieldsList.push('adm2');
    fieldsList.push('adm2_name');
  }

  url = `${url}/${dataset}/v202209/download/csv?sql=SELECT ${fieldsList} FROM data ${where}`;
  // console.info(`Download url: ${url}`);

  return { url };
};

// this PoC is only meant for net change widget (we chose net change for its simplicity)
export default async (req, res) => {
  const { adm0 = '', adm1 = '', adm2 = '', download } = req.query;
  const isDownload = download === 'true';
  let response = null;

  try {
    if (isDownload) {
      response = await get_net_tree_cover_change_download_url(adm0, adm1, adm2);
    } else {
      response = await get_net_tree_cover_change_results(adm0, adm1, adm2);
    }

    return res.status(200).json({ data: response });
  } catch (error) {
    // console.error('Error fetching net tree cover change data from the GFW data mart:', { message: error.message });
    return res.status(500).json({
      error: 'Failed to fetch net tree cover change data.',
    });
  }
};
