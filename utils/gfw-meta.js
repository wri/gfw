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

export async function handleGfwParamsMeta(params) {
  const paramsMeta = {
    GLAD: null,
    VIIRS: null,
    INTEGRATED: null,
  };

  if (isEmpty(params?.GFW_META?.datasets)) {
    const meta = await getGfwMeta();
    Object.keys(paramsMeta).forEach((key) => {
      paramsMeta[key] = meta?.datasets?.[key];
    });
  } else {
    Object.keys(paramsMeta).forEach((key) => {
      paramsMeta[key] = params?.GFW_META?.datasets?.[key];
    });
  }

  return paramsMeta;
}
