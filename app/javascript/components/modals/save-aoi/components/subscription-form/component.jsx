import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getLanguages } from 'utils/lang';
import cx from 'classnames';

import Toggle from 'components/ui/toggle';
import Checkbox from 'components/ui/checkbox-v2';
import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import InputTags from 'components/input-tags';

import screenImg1x from 'assets/images/aois/single.png';
import screenImg2x from 'assets/images/aois/single @2x.png';

import './styles.scss';

function SubscriptionForm(props) {
  const {
    activeArea,
    saveAOI,
    userData,
    saving,
    error,
    setSaveAOISettings
  } = props;

  const [form, setForm] = useState({
    name: props.locationName,
    tags: [],
    email: props.email,
    emailError: false,
    nameError: false,
    receiveAlerts: false,
    lang: props.lang,
    changesEmail: true,
    monthlyEmail: true
  });

  useEffect(
    () => {
      setSaveAOISettings(form);
    },
    [form, setSaveAOISettings]
  );

  useEffect(
    () => {
      if (activeArea) {
        setForm(state => ({
          ...state,
          name: props.activeArea.name,
          tags: props.activeArea.tags,
          email: props.email,
          receiveAlerts: props.activeArea.receiveAlerts,
          lang: props.lang,
          changesEmail: props.activeArea.changesEmail,
          monthlyEmail: props.activeArea.monthlyEmail
        }));
      }
    },
    [props.activeArea, props.lang, props.email, activeArea]
  );

  const validateEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const {
    lang,
    name,
    email,
    emailError,
    nameError,
    receiveAlerts,
    changesEmail,
    monthlyEmail
  } = form;
  const canSubmit = validateEmail(email) && name && lang;

  return (
    <div className="c-form c-subscription-form">
      <div className={cx('field', { error: nameError })}>
        <span className="form-title">Name this area for later reference</span>
        <input
          className="text-input"
          value={name}
          onChange={e =>
            setForm(state => ({
              ...state,
              name: e.target.value,
              nameError: !e.target.value
            }))
          }
        />
      </div>
      <div className={cx('field', { error: nameError })}>
        <span className="form-title">
          Assign tags to organize and group areas
        </span>
        <InputTags />
      </div>
      <div className={cx('field')}>
        <span className="form-toggle">
          <Toggle
            onToggle={() =>
              setForm(state => ({
                ...state,
                receiveAlerts: !receiveAlerts
              }))
            }
            value={receiveAlerts}
            theme="toggle-large"
          />
          <p className="form-title">
            Receive alert emails about deforestation in this area
          </p>
        </span>
      </div>
      <div className={cx('field', 'field-image')}>
        <img
          src={screenImg1x}
          srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
          alt="aoi screenshot"
        />
        <p>
          We will send you email updates about alerts and forest cover change in
          your selected area.
        </p>
      </div>
      <div className={cx('field', { error: emailError })}>
        <span className="form-title">Email</span>
        <input
          className="text-input"
          value={email}
          onChange={e =>
            setForm(state => ({
              ...state,
              email: e.target.value,
              emailError: !validateEmail(e.target.value)
            }))
          }
        />
      </div>
      <div className="field">
        <span className="form-title">Language*</span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={getLanguages()}
          value={lang}
          onChange={newLang =>
            setForm(state => ({
              ...state,
              lang: newLang
            }))
          }
          native
        />
      </div>
      <div className="field">
        <Checkbox
          className="form-checkbox"
          option={{ value: 'changesEmail', name: 'Changes email ?' }}
          onChange={() =>
            setForm(state => ({
              ...state,
              changesEmail: !changesEmail
            }))
          }
          checked={changesEmail}
          label={'As soon as forest change is detected'}
        />
        <Checkbox
          className="form-checkbox"
          option={{ value: 'changesEmail', name: 'Changes email ?' }}
          onChange={() =>
            setForm(state => ({
              ...state,
              monthlyEmail: !monthlyEmail
            }))
          }
          checked={monthlyEmail}
          label={'Monthly summary'}
        />
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
            saveAOI({
              ...form,
              userData
              // ...location
            })
          }
          disabled={!canSubmit}
        >
          {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
        </Button>
      </div>
    </div>
  );
}

SubscriptionForm.propTypes = {
  setSaveAOISettings: PropTypes.func,
  saveAOI: PropTypes.func,
  userData: PropTypes.object,
  lang: PropTypes.string,
  locationName: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  activeArea: PropTypes.object
};

export default SubscriptionForm;
