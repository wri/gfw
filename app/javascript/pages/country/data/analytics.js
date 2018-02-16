export const ANALYTICS_EVENTS = [
  {
    actionKey: 'setShareData',
    category: 'Country Page',
    action: 'Share page',
    payloadKey: 'country',
    comparison: (payload) => payload.title === 'Share this Dashboard'
  },
];
