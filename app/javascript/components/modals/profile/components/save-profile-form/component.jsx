import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getLanguages } from 'utils/lang';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox-v2';

import formConfig from './config';

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
    case 'sector': {
      return {
        ...state,
        sector: payload
      };
    }
    case 'primaryResponsibilities': {
      return {
        ...state,
        primaryResponsibilities: payload
      };
    }
    case 'howDoYouUse': {
      return {
        ...state,
        howDoYouUse: payload
      };
    }
    case 'country': {
      return {
        ...state,
        country: payload
      };
    }
    case 'city': {
      return {
        ...state,
        city: payload
      };
    }
    case 'state': {
      return {
        ...state,
        state: payload
      };
    }
    case 'signUpForTesting': {
      return {
        ...state,
        signUpForTesting: !state.signUpForTesting
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
  const { userData, countries, saving, error, saveProfile } = props;

  const [form, dispatch] = useReducer(reducer, {
    name: userData.fullName,
    email: userData.email,
    emailError: false,
    nameError: false,
    lang: userData.language,
    sector: userData.sector,
    primaryResponsibilities: userData.primaryResponsibilities,
    howDoYouUse: userData.howDoYouUse,
    state: userData.state,
    city: userData.city,
    country: userData.country,
    signUpForTesting: userData.signUpForTesting
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
    <div className="save-profile">
      <Button
        className={cx('submit-btn', { error }, { saving })}
        onClick={() => saveProfile({ ...userData, ...form })}
        disabled={!canSubmit}
      >
        {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
      </Button>
    </div>
  );

  const {
    lang,
    name,
    email,
    sector,
    primaryResponsibilities,
    howDoYouUse,
    city,
    state,
    country,
    signUpForTesting,
    emailError,
    nameError
  } = form;
  const canSubmit = validateEmail(email) && name && lang;
  const {
    sectors,
    responsibilities,
    howDoYouUse: howDoYouUseOptions
  } = formConfig;

  return (
    <div className="c-form c-save-profile-form">
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
      <div className="field">
        <span className="form-title">Sector*</span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={sectors.map(s => ({ label: s, value: s }))}
          value={sector}
          onChange={newSector =>
            dispatch({ type: 'sector', payload: newSector })
          }
          native
        />
      </div>
      <div className="field">
        <span className="form-title">
          PRIMARY RESPONSIBILITIES (SELECT ALL THAT APPLY)*
        </span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={responsibilities.map(r => ({ label: r, value: r }))}
          value={primaryResponsibilities}
          onChange={newResponsibility => {
            const hasResp = primaryResponsibilities.includes(newResponsibility);
            const newResp = hasResp
              ? primaryResponsibilities.filter(r => r !== newResponsibility)
              : primaryResponsibilities.concat(newResponsibility);
            dispatch({ type: 'primaryResponsibilities', payload: newResp });
          }}
          native
          multiple
        />
      </div>
      <div className="field">
        <span className="form-title">
          HOW DO YOU USE OR PLAN TO USE GLOBAL FOREST WATCH? (SELECT ALL THAT
          APPLY)
        </span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={howDoYouUseOptions.map(r => ({ label: r, value: r }))}
          value={howDoYouUse}
          onChange={newHowDoYouUse => {
            const hasHowDo = howDoYouUse.includes(newHowDoYouUse);
            const newHowDo = hasHowDo
              ? howDoYouUse.filter(r => r !== newHowDoYouUse)
              : howDoYouUse.concat(newHowDoYouUse);
            dispatch({ type: 'howDoYouUse', payload: newHowDo });
          }}
          native
          multiple
        />
      </div>
      <div className="field">
        <span className="form-title">Country*</span>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={countries}
          value={country}
          onChange={newCountry =>
            dispatch({ type: 'country', payload: newCountry })
          }
          native
        />
      </div>
      <div className="field">
        <span className="form-title">City</span>
        <input
          className="text-input"
          value={city}
          onChange={e => dispatch({ type: 'city', payload: e.target.value })}
        />
      </div>
      <div className="field">
        <span className="form-title">State / department / province</span>
        <input
          className="text-input"
          value={state}
          onChange={e => dispatch({ type: 'state', payload: e.target.value })}
        />
      </div>
      <div className="field">
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'signUpForTesting' })}
          checked={signUpForTesting}
          label={
            'Interested in testing new features and helping to improve Global Forest Watch? Sign up to become an official tester!'
          }
        />
      </div>
      {renderSaveProfile()}
      <p className="delete-profile">
        If you wish to delete your My GFW account, please{' '}
        <a href="mailto:gfw@wri-org">email us</a>.
      </p>
    </div>
  );
}

SaveProfileForm.propTypes = {
  saveProfile: PropTypes.func,
  userData: PropTypes.object,
  countries: PropTypes.array,
  error: PropTypes.bool,
  saving: PropTypes.bool
};

export default SaveProfileForm;
