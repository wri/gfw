import ReactGA from 'react-ga';
import { ANALYTICS_EVENTS } from 'pages/country/data/analytics';
import get from 'lodash/get';

const { ANALYTICS_PROPERTY_ID } = process.env;
let gaInitialized = false;

const initGA = () => {
  if (ANALYTICS_PROPERTY_ID) {
    if (!gaInitialized) {
      ReactGA.initialize(ANALYTICS_PROPERTY_ID);
      gaInitialized = true;
    }
  }
};

export const handlePageTrack = location => {
  initGA();
  if (gaInitialized) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(window.location.href);
  }
};

export const handleActionTrack = state => nextDispatch => action => {
  initGA();
  if (gaInitialized) {
    // get all events that match action key
    const GAEvents = ANALYTICS_EVENTS.filter(
      g => g.name && g.name === action.type
    );

    // get the payload of the action
    const actionPayload = {
      ...state.getState().location.payload,
      ...action.query,
      ...action.payload,
      ...action.meta
    };

    // use comparison to find correct action
    let event = GAEvents.find(e => !e.comparison);
    GAEvents.forEach(e => {
      if (e.comparison && e.comparison(actionPayload)) {
        event = e;
      }
    });

    // process event if available
    if (event) {
      const eventPayload = {
        category: event.category,
        action:
          typeof event.action === 'string'
            ? event.action
            : event.action(actionPayload),
        label: event.label || get(actionPayload, event.payloadKey)
      };
      if (eventPayload.label) {
        ReactGA.event(eventPayload);
      }
    }
  }
  nextDispatch(action);
};
