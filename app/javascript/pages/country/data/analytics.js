export const ANALYTICS_EVENTS = [
  {
    name: 'setShareData',
    category: 'Country Page',
    action: 'Share page',
    payloadKey: 'country',
    comparison: payload => payload.title === 'Share this Dashboard'
  },
  {
    name: 'location/COUNTRY',
    category: 'Country Page',
    action: 'View',
    payloadKey: 'query.category'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'User views a widget on the map',
    payloadKey: 'widget',
    comparison: payload => payload.widget
  },
  {
    name: 'setModalMetaData',
    category: 'Country Page',
    action: 'Info',
    payloadKey: 'title'
  },
  {
    name: 'setShareData',
    category: 'Country Page',
    action: 'Share Widget',
    payloadKey: 'subtitle',
    comparison: payload => payload.title === 'Share this widget'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'Download page',
    payloadKey: 'country',
    comparison: payload => payload.title === 'download'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: 'User clicks through to main map',
    payloadKey: 'layers',
    comparison: payload => payload.title === 'view-full-map'
  },
  {
    name: 'buttonClicked',
    category: 'Country Page',
    action: payload => `Share on ${payload.socialNetwork}`,
    payloadKey: 'socialText',
    comparison: payload => payload.socialNetwork
  },
  {
    name: 'setShareCopied',
    category: 'Country Page',
    action: 'Copies embed code',
    payloadKey: 'subtitle'
  }
];
