import { fetchGLADLatest, fetchVIIRSLatest } from 'services/analysis-cached';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

export default async function getGfwMeta() {
  const gladLatest = await fetchGLADLatest();
  const viirsLatest = await fetchVIIRSLatest();
  return {
    datasets: {
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
