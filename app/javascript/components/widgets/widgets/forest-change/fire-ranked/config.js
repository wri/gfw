export default {
  widget: 'fireRanked',
  title: 'Location of fire Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    units: ['%', 'counts ha-1'],
    weeks: true
  },
  metaKey: 'widget_fire_alert_ranking_location',
  colors: 'loss',
  datasets: [
    // FIRES
    {
      dataset: '0f24299d-2aaa-4afc-945c-b614028c12d1'
    }
  ],
  sortOrder: {
    summary: 6,
    forestChange: 10
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, {count} fire alerts were detected, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all fire alerts.',
    withInd:
      'In the last {timeframe} in {location}, {count} fire alerts were detected within {indicator}, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all fire alerts.'
  },
  whitelists: {
   
}
};
