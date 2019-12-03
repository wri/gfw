import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CountryDataProvider from 'providers/country-data-provider';
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
    case 'comments':
      return { ...state, comments: payload.comments };
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
    saveSubscription,
    saving,
    error,
    email: propsEmail,
    countries
  } = props;

  useEffect(
    () => {
      if (propsEmail) {
        dispatch({
          type: 'reset',
          payload: {
            email: propsEmail,
            emailError: false,
            firstNameError: false,
            lastNameError: false
          }
        });
      }
    },
    [propsEmail]
  );

  useEffect(
    () => {
      if (countries && countries.length) {
        dispatch({ type: 'reset', payload: { countries } });
      }
    },
    [countries]
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
    email: propsEmail || '',
    emailError: false,
    organization: '',
    city: '',
    cityError: false,
    comments: '',
    country: '',
    subscriptions: subscriptions.reduce(
      (acc, sub) => ({ ...acc, [sub.label]: false }),
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
      <CountryDataProvider />
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
        </div>
      </div>
      <div className="row">
        <div className="suscribe-form column small-12 medium-8 medium-offset-2">
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
          <div className={cx('field', 'hidden')}>
            <span>Comments*</span>
            <input
              className="form-input"
              value={state.comments}
              onChange={e =>
                dispatch({
                  type: 'comments',
                  payload: {
                    comments: e.target.value
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
              options={
                state.countries && [
                  { label: 'Select country', value: '' },
                  ...state.countries
                ]
              }
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
          <div className="field">
            <span className="blank-label" />
            <div className="form-list">
              <span>I&#39;m interested in (check all that apply)*</span>
              {subscriptions.map(sub => (
                <div className="form-checkbox-item" key={sub.value}>
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
        </div>
      </div>
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <div className="save-subscription">
            <Button
              className={cx('submit-btn', { error }, { saving })}
              onClick={() =>
                saveSubscription({
                  ...state
                })
              }
              disabled={!canSubmit}
            >
              SUBSCRIBE
              {saving && <Loader className="saving-btn-loader" />}
            </Button>
            {error && (
              <p className="error-message">
                This service is currently unavailable. Please try again later.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SubscribePage.propTypes = {
  metadata: PropTypes.object,
  saveSubscription: PropTypes.func,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  countries: PropTypes.array
};

export default SubscribePage;
