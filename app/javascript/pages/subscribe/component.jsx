import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox-v2';

import './styles.scss';

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'firstName':
      return {
        ...state,
        firstName: payload.name,
        firstNameError: payload.nameError
      };
    case 'lastName':
      return {
        ...state,
        lastName: payload.name,
        lastNameError: payload.nameError
      };
    case 'email':
      return { ...state, email: payload.email, emailError: payload.emailError };
    case 'organization':
      return { ...state, organization: payload.organization };
    case 'city':
      return { ...state, city: payload.city, cityError: payload.cityError };
    case 'country':
      return {
        ...state,
        country: payload.country,
        countryError: payload.countryError
      };
    case 'subscriptions':
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [payload.sub]: !state.subscriptions[payload.sub]
        }
      };
    case 'reset':
      return { ...state, ...payload };
    default:
      return state;
  }
}

function SubscribePage(props) {
  const {
    metadata,
    activeDatasets,
    saveSubscription,
    userData,
    saving,
    error,
    location,
    setSubscribeSettings,
    activeMapDatasets,
    lang: propsLang,
    email: propsEmail
  } = props;

  useEffect(
    () => {
      if (activeMapDatasets && activeMapDatasets.length) {
        setSubscribeSettings({ datasets: activeMapDatasets });
      }
    },
    [activeMapDatasets, setSubscribeSettings]
  );

  useEffect(
    () => {
      dispatch({
        type: 'reset',
        payload: {
          email: propsEmail,
          lang: propsLang,
          emailError: false,
          nameError: false
        }
      });
    },
    [propsEmail, propsLang]
  );

  const subscriptions = [
    { label: 'Innovations in Monitoring', value: 'monitoring' },
    { label: 'Fires', value: 'fires' },
    { label: 'Forest Watcher Mobile App', value: 'fwapp' },
    { label: 'Climate and Biodiversity', value: 'climate' },
    { label: 'Agricultural Supply Chains', value: 'supplychains' },
    { label: 'Small Grants Fund and Tech Fellowship', value: 'sgf' }
  ];

  /*
  State
  */
  const initialState = {
    firstName: '',
    firstNameError: false,
    lastName: '',
    lastNameError: false,
    email: propsEmail,
    emailError: false,
    organization: '',
    city: '',
    cityError: false,
    country: null,
    subscriptions: subscriptions.reduce(
      (acc, sub) => ({ ...acc, [sub.label]: true }),
      {}
    )
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  /*
  Helper functions
  */
  const validateEmail = address => {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(address).toLowerCase());
  };

  const canSubmit =
    validateEmail(state.email) &&
    !!state.firstName &&
    !!state.lastName &&
    !!state.city &&
    !!state.country &&
    Object.values(state.subscriptions).filter(sub => sub).length > 0;

  return (
    <div className="l-subscribe-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <div className="subscribe-header">
            <h1>
              {(metadata && metadata.title) || 'Sorry, something went wrong.'}
            </h1>
            <h3>
              {(metadata && metadata.desc) ||
                'Try refreshing the page or check your connection.'}
            </h3>
          </div>
          <div className="suscribe-form column small-12 medium-8 medium-offset-1">
            <div className={cx('field', { error: state.firstNameError })}>
              <span>First Name*</span>
              <input
                className="form-input"
                value={state.firstName}
                onChange={e =>
                  dispatch({
                    type: 'firstName',
                    payload: {
                      name: e.target.value,
                      nameError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.lastNameError })}>
              <span>Last Name*</span>
              <input
                className="form-input"
                value={state.lastName}
                onChange={e =>
                  dispatch({
                    type: 'lastName',
                    payload: {
                      name: e.target.value,
                      nameError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.emailError })}>
              <span>Email*</span>
              <input
                className="form-input"
                value={state.email}
                onChange={e =>
                  dispatch({
                    type: 'email',
                    payload: {
                      email: e.target.value,
                      emailError: !validateEmail(e.target.value)
                    }
                  })
                }
              />
            </div>
            <div className="field">
              <span>Organization</span>
              <input
                className="form-input"
                value={state.organization}
                onChange={e =>
                  dispatch({
                    type: 'organization',
                    payload: { organization: e.target.value }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.cityError })}>
              <span>City*</span>
              <input
                className="form-input"
                value={state.city}
                onChange={e =>
                  dispatch({
                    type: 'city',
                    payload: {
                      city: e.target.value,
                      cityError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.countryError })}>
              <span>Country*</span>
              <Dropdown
                className="form-input"
                theme="theme-dropdown-native-form"
                options={[
                  { label: 'Select country', value: '' },
                  { label: 'Spain', value: 'ES' },
                  { label: 'United Kingdom', value: 'UK' }
                ]}
                value={state.country}
                onChange={country =>
                  dispatch({
                    type: 'country',
                    payload: {
                      country,
                      countryError: !country
                    }
                  })
                }
                native
              />
            </div>
            <div className="field form-list small-12 medium-8 medium-offset-1">
              <span>I&#39;m interested in (check all that apply)*</span>
              {subscriptions.map(sub => (
                <div className="form-checkbox-item">
                  <Checkbox
                    className="form-checkbox"
                    checked={state.subscriptions[sub.label]}
                    onChange={() =>
                      dispatch({
                        type: 'subscriptions',
                        payload: { sub: sub.label }
                      })
                    }
                    label={sub.label}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="save-subscription">
            {error ? (
              <p className="error-message">
                This service is currently unavailable. Please try again later.
              </p>
            ) : (
              <p>You can always change these settings in MyGFW</p>
            )}
            <Button
              className={cx('submit-btn', { error }, { saving })}
              onClick={() =>
                saveSubscription({
                  ...state,
                  datasets: activeDatasets,
                  userData,
                  ...location
                })
              }
              disabled={!canSubmit}
            >
              {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

SubscribePage.propTypes = {
  metadata: PropTypes.object,
  setSubscribeSettings: PropTypes.func,
  saveSubscription: PropTypes.func,
  userData: PropTypes.object,
  activeDatasets: PropTypes.array,
  lang: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  location: PropTypes.object,
  activeMapDatasets: PropTypes.array
};

export default SubscribePage;
