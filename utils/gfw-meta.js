import {
  fetchGLADLatest,
  fetchIntegratedLatest,
  fetchVIIRSLatest,
} from 'services/analysis-cached';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

export default async function getGfwMeta() {
  const gladLatest = await fetchGLADLatest();
  const integratedLatest = await fetchIntegratedLatest();
  const viirsLatest = await fetchVIIRSLatest();
  return {
    datasets: {
      INTEGRATED: {
        ...integratedLatest?.attributes,
        ...(integratedLatest?.attributes?.updatedAt && {
          defaultStartDate: moment(integratedLatest?.attributes.updatedAt)
            .add(-7, 'days')
            .format('YYYY-MM-DD'),
          defaultEndDate: integratedLatest?.attributes.updatedAt,
        }),
      },
      GLAD: {
        ...gladLatest?.attributes,
        ...(gladLatest?.attributes?.updatedAt && {
          defaultStartDate: moment(gladLatest?.attributes.updatedAt)
            .add(-7, 'days')
            .format('YYYY-MM-DD'),
          defaultEndDate: gladLatest?.attributes.updatedAt,
        }),
      },
      VIIRS: {
        ...viirsLatest,
        ...(viirsLatest?.date && {
          defaultStartDate: moment(viirsLatest?.date)
            .add(-7, 'days')
            .format('YYYY-MM-DD'),
          defaultEndDate: viirsLatest?.date,
        }),
      },
    },
  };
}

export async function handleGladMeta(params) {
  let GLAD;
  if (isEmpty(params?.GFW_META?.datasets)) {
    const meta = await getGfwMeta();
    GLAD = meta?.datasets?.GLAD;
  } else {
    GLAD = params?.GFW_META?.datasets?.GLAD;
  }
  return GLAD;
}

export async function handleViirsMeta(params) {
  let VIIRS;
  if (isEmpty(params?.GFW_META?.datasets)) {
    const meta = await getGfwMeta();
    VIIRS = meta?.datasets?.VIIRS;
  } else {
    VIIRS = params?.GFW_META?.datasets?.VIIRS;
  }
  return VIIRS;
}

export async function handleIntegratedMeta(params) {
  let INTEGRATED;
  if (isEmpty(params?.GFW_META?.datasets)) {
    const meta = await getGfwMeta();
    INTEGRATED = meta?.datasets?.INTEGRATED;
  } else {
    INTEGRATED = params?.GFW_META?.datasets?.INTEGRATED;
  }
  return INTEGRATED;
}
