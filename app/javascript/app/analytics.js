import * as shareActions from 'components/modals/share/share-actions';
import * as modalActions from 'components/modals/meta/meta-actions';
import * as buttonActions from 'components/ui/button/button-actions';
import * as widgetActions from 'components/widgets/actions';
import { DASHBOARDS } from 'router';

const allActions = {
  ...shareActions,
  ...buttonActions,
  ...modalActions,
  ...widgetActions
};
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
    name: DASHBOARDS,
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
    name: actions.settingsItemSelected,
    category: 'Country Widget Settings',
    action: payload => `Change ${Object.keys(payload.value)[0]}`,
    label: payload =>
      `${payload.value[Object.keys(payload.value)[0]]} | ${payload.widget}`
  },
  {
    name: actions.buttonClicked,
    category: 'Country Page',
    action: 'User opens settings menu',
    label: payload => payload.label,
    condition: payload => payload.event === 'open-settings'
  }
];
