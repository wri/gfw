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
        defaultStartDate: moment(gladLatest.attributes.updatedAt)
          .add(-7, 'days')
          .format('YYYY-MM-DD'),
        defaultEndDate: gladLatest.attributes.updatedAt,
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
  const isMetaParamsEmpty = isEmpty(params?.GFW_META?.datasets);
  let gfwMetaParams;

  if (isMetaParamsEmpty) {
    gfwMetaParams = await getGfwMeta();

    return gfwMetaParams?.datasets;
  }

  return params.GFW_META.datasets;
}
