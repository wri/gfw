import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getLanguages } from 'utils/lang';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';

import './styles.scss';

function validateEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function reducer(state, action) {
  const { payload } = action;
  switch (action.type) {
    case 'name': {
      return {
        ...state,
        name: payload,
        nameError: !payload
      };
    }
    case 'email': {
      return {
        ...state,
        email: payload,
        emailError: !validateEmail(payload)
      };
    }
    case 'lang': {
      return {
        ...state,
        lang: payload
      };
    }
    case 'userData': {
      const { userData } = payload;

      return {
        ...state,
        ...userData
      };
    }
    default:
      return state;
  }
}

function SaveProfileForm(props) {
  const { userData, saving, error, saveProfile } = props;

  const [form, dispatch] = useReducer(reducer, {
    name: props.userData.fullName,
    email: props.userData.email,
    emailError: false,
    nameError: false,
    lang: props.userData.language
  });

  useEffect(
    () => {
      if (userData) {
        dispatch({ type: 'userData', payload: { userData } });
      }
    },
    [userData]
  );

  const renderSaveProfile = () => (
    <div className="save-aoi">
      <Button
        className={cx('submit-btn', { error }, { saving })}
        onClick={() => saveProfile(form)}
        disabled={!canSubmit}
      >
        {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
      </Button>
    </div>
  );

  const { lang, name, email, emailError, nameError } = form;
  const canSubmit = validateEmail(email) && name && lang;

  return (
    <div className="c-form c-save-aoi-form">
      <div className={cx('field', { error: nameError })}>
        <span className="form-title">Name</span>
        <input
          className="text-input"
          value={name}
          onChange={e => dispatch({ type: 'name', payload: e.target.value })}
        />
      </div>
      <div className={cx('field', { error: emailError })}>
        <span className="form-title">Email</span>
        <input
          className="text-input"
          value={email}
          onChange={e => dispatch({ type: 'email', payload: e.target.value })}
        />
      </div>
      <div className="field">
        <span className="form-title">Language*</span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={getLanguages()}
          value={lang}
          onChange={newLang => dispatch({ type: 'lang', payload: newLang })}
          native
        />
      </div>
      {renderSaveProfile()}
    </div>
  );
}

SaveProfileForm.propTypes = {
  saveProfile: PropTypes.func,
  userData: PropTypes.object,
  fullName: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool
};

export default SaveProfileForm;
