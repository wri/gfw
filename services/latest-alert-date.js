import moment from 'moment';

import { dataRequest } from 'utils/request';

// Alert datasets are republished daily, so content_date_range.end_date tracks the
// publication date rather than the most recent alert present in the data. When an
// upstream feed stalls, the two drift apart: date ranges land on empty windows and
// the map time slider offers days that hold no alerts, with no hint that the data
// is behind. Anchor on the latest alert the precomputed tables can actually serve,
// so the dashboards and the map agree on where each alert system ends.
// `gfw_integrated_dist_alerts` — the combined layer that also carries DIST-ALERT —
// is deliberately absent: no GADM daily-alerts table is published for it, and
// clamping it to the integrated one would cut off the DIST-ALERT days it holds.
export const LATEST_ALERT_TABLES = {
  umd_glad_landsat_alerts: {
    table: 'gadm__glad__iso_daily_alerts',
    dateColumn: 'umd_glad_landsat_alerts__date',
  },
  umd_glad_sentinel2_alerts: {
    table: 'gadm__integrated_alerts__iso_daily_alerts',
    dateColumn: 'umd_glad_sentinel2_alerts__date',
  },
  wur_radd_alerts: {
    table: 'gadm__integrated_alerts__iso_daily_alerts',
    dateColumn: 'wur_radd_alerts__date',
  },
  gfw_integrated_alerts: {
    table: 'gadm__integrated_alerts__iso_daily_alerts',
    dateColumn: 'gfw_integrated_alerts__date',
  },
};

export const fetchLatestAlertDate = ({ table, dateColumn }, publishedEndDate) =>
  dataRequest
    .get(
      encodeURI(
        `/dataset/${table}/latest/query?sql=SELECT MAX(${dateColumn}) FROM data`
      )
    )
    .then((response) => {
      const latestAlertDate = response?.data?.[0]?.max;

      if (!latestAlertDate) {
        return publishedEndDate;
      }

      // The precomputed table is derived from the raster, so it can never lead it.
      return moment(latestAlertDate).isBefore(publishedEndDate)
        ? latestAlertDate
        : publishedEndDate;
    })
    .catch(() => publishedEndDate);

// Layer configs point `latestUrl` at the dataset's metadata endpoint, e.g.
// `dataset/umd_glad_landsat_alerts/latest`.
export const alertDatasetFromUrl = (latestUrl) => {
  const [, dataset] = /dataset\/([^/?]+)/.exec(latestUrl || '') || [];

  return dataset;
};

// Datasets we have no alert table for keep the date they came with, without a
// request: this runs for every layer the map turns on, not just the alert ones.
export const resolveLatestAlertDate = (dataset, publishedEndDate) => {
  const source = LATEST_ALERT_TABLES[dataset];

  if (!source || !publishedEndDate) {
    return Promise.resolve(publishedEndDate);
  }

  return fetchLatestAlertDate(source, publishedEndDate);
};
