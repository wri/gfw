import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox';

import './styles.scss';

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'name':
      return { ...state, name: payload.name, nameError: payload.nameError };
    case 'email':
      return { ...state, email: payload.email, emailError: payload.emailError };
    case 'language':
      return { ...state, lang: payload.lang };
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
    locationName: propsName,
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
          name: propsName,
          email: propsEmail,
          lang: propsLang,
          emailError: false,
          nameError: false
        }
      });
    },
    [propsName, propsEmail, propsLang]
  );

  /*
  State
  */
  const initialState = {
    name: propsName,
    email: propsEmail,
    lang: propsLang,
    emailError: false,
    nameError: false
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
    activeDatasets &&
    activeDatasets.length &&
    validateEmail(state.email) &&
    state.name &&
    state.lang;

  const subscriptions = [
    { label: 'Innovations in Monitoring', value: 'monitoring' },
    { label: 'Fires', value: 'fires' },
    { label: 'Forest Watcher Mobile App', value: 'fwapp' },
    { label: 'Climate and Biodiversity', value: 'climate' },
    { label: 'Agricultural Supply Chains', value: 'supplychains' },
    { label: 'Small Grants Fund and Tech Fellowship', value: 'sgf' }
  ];

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
            <div className={cx('field', { error: state.nameError })}>
              <span>First Name*</span>
              <input
                className="form-input"
                value={state.name}
                onChange={e =>
                  dispatch({
                    type: 'name',
                    payload: {
                      name: e.target.value,
                      nameError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.nameError })}>
              <span>Last Name*</span>
              <input
                className="form-input"
                value={state.name}
                onChange={e =>
                  dispatch({
                    type: 'name',
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
                value={state.name}
                onChange={e =>
                  dispatch({
                    type: 'name',
                    payload: {
                      name: e.target.value,
                      nameError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className={cx('field', { error: state.cityError })}>
              <span>City*</span>
              <input
                className="form-input"
                value={state.name}
                onChange={e =>
                  dispatch({
                    type: 'name',
                    payload: {
                      name: e.target.value,
                      nameError: !e.target.value
                    }
                  })
                }
              />
            </div>
            <div className="field">
              <span>Country*</span>
              <Dropdown
                className="form-input"
                theme="theme-dropdown-native-form"
                options={[
                  { label: 'Spain', value: 'ES' },
                  { label: 'United Kingdom', value: 'UK' }
                ]}
                value={state.lang}
                onChange={newLang =>
                  dispatch({ type: 'language', payload: { lang: newLang } })
                }
                native
              />
            </div>
            <div className="field form-list small-12 medium-8 medium-offset-1">
              <span>I&#39;m interested in (check all that apply)*</span>
              {subscriptions.map(sub => (
                <div className="form-checkbox-item">
                  <Checkbox className="form-checkbox" value />
                  {sub.label}
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
  locationName: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  location: PropTypes.object,
  activeMapDatasets: PropTypes.array
};

export default SubscribePage;
