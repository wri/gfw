export default {
  widget: 'firesRanked',
  title: 'Regions with the most fire Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    weeks: true
  },
  metaKey: 'widget_fire_alert_ranking_location',
  colors: 'fires',
  sortOrder: {
    summary: 6,
    forestChange: 10
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, the region with the most fires burning was {topRegion}, with {topRegionCount} fire alerts, representing {topRegionPerc} of total alerts detected.',
    withInd:
      'In the last {timeframe} in {location}, the region with the most fires burning within {indicator} was {topRegion}, with {topRegionCount} fire alerts, representing {topRegionPerc} of total alerts detected.'
  }
};
