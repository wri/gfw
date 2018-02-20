import shareActions from 'components/share/share-actions';
import modalActions from 'components/modal-meta/modal-meta-actions';
import buttonActions from 'components/button/button-actions';
import { COUNTRY } from 'pages/country/router';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

const allActions = { ...shareActions, ...buttonActions, ...modalActions };
const actions = Object.keys(allActions).reduce(
  (state, action) => ({
    ...state,
    [action]: allActions[action].toString()
  }),
  {}
);

export const ANALYTICS_EVENTS = [
  {
    name: actions.setShareData,
    category: 'Country Page',
    action: 'Share page',
    label: payload => payload.country,
    condition: payload => payload.title === 'Share this Dashboard'
  },
  {
    name: COUNTRY,
    category: 'Country Page',
    action: 'View',
    label: payload => payload && payload.query && payload.query.category
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: 'User views a widget on the map',
    label: payload => payload.widget,
    condition: payload => payload.widget
  },
  {
    name: actions.setModalMetaData,
    category: 'Country Page',
    action: 'Info',
    label: payload => payload.title
  },
  {
    name: actions.setShareData,
    category: 'Country Page',
    action: 'Share Widget',
    label: payload => payload.subtitle,
    condition: payload => payload.title === 'Share this widget'
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: 'Download page',
    label: payload => payload.country,
    condition: payload => payload.title === 'download'
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: 'User clicks through to main map',
    label: payload => payload.layers,
    condition: payload => payload.title === 'view-full-map'
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: payload => `Share on ${payload.socialNetwork}`,
    label: payload => payload.socialText,
    condition: payload => payload.socialNetwork
  },
  {
    name: actions.setShareCopied,
    category: 'Country Page',
    action: 'Copies embed code',
    label: payload => payload.subtitle
  },
  {
    name: COUNTRY,
    category: 'Country Page',
    action: 'User changes widget settings',
    label: 'User changed settings',
    condition: payload => {
      const location = payload && payload.location;
      const current =
        location &&
        location.current &&
        location.current.query &&
        omit(location.current.query, ['widget', 'category']);
      const prev =
        location &&
        location.prev &&
        location.prev.query &&
        omit(location.prev.query, ['widget', 'category']);
      return current && prev && !isEqual(current, prev);
    }
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: 'User opens settings menu',
    label: payload => payload.label,
    condition: payload => payload.event === 'open-settings'
  }
];
