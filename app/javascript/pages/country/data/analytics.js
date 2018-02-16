export const ANALYTICS_EVENTS = [
  {
    name: 'setShareData',
    category: 'Country Page',
    action: 'Share page',
    label: payload => payload.country,
    condition: payload => payload.title === 'Share this Dashboard'
  },
  {
    name: 'location/COUNTRY',
    category: 'Country Page',
    action: 'View',
    label: payload => payload && payload.query && payload.query.category
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'User views a widget on the map',
    label: payload => payload.widget,
    condition: payload => payload.widget
  },
  {
    name: 'setModalMetaData',
    category: 'Country Page',
    action: 'Info',
    label: payload => payload.title
  },
  {
    name: 'setShareData',
    category: 'Country Page',
    action: 'Share Widget',
    label: payload => payload.subtitle,
    condition: payload => payload.title === 'Share this widget'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'Download page',
    label: payload => payload.country,
    condition: payload => payload.title === 'download'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'User clicks through to main map',
    label: payload => payload.layers,
    condition: payload => payload.title === 'view-full-map'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: payload => `Share on ${payload.socialNetwork}`,
    label: payload => payload.socialText,
    condition: payload => payload.socialNetwork
  },
  {
    name: 'setShareCopied',
    category: 'Country Page',
    action: 'Copies embed code',
    label: payload => payload.subtitle
  }
];
