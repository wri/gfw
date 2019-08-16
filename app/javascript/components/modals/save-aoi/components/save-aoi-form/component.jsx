import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getLanguages } from 'utils/lang';
import cx from 'classnames';

import Toggle from 'components/ui/toggle';
import Checkbox from 'components/ui/checkbox-v2';
import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import InputTags from 'components/input-tags';

import deleteIcon from 'assets/icons/delete.svg';
import screenImg1x from 'assets/images/aois/singleB.png';
import screenImg2x from 'assets/images/aois/singleB@2x.png';

import placeholderAreaBg from './aoi-placeholder-bg.png';
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
    case 'tags': {
      return {
        ...state,
        tags: payload
      };
    }
    case 'email': {
      return {
        ...state,
        email: payload,
        emailError: !validateEmail(payload)
      };
    }
    case 'receiveAlerts': {
      return {
        ...state,
        receiveAlerts: !state.receiveAlerts
      };
    }
    case 'lang': {
      return {
        ...state,
        lang: payload
      };
    }
    case 'changesEmail': {
      return {
        ...state,
        changesEmail: !state.changesEmail
      };
    }
    case 'monthlyEmail': {
      return {
        ...state,
        monthlyEmail: !state.monthlyEmail
      };
    }
    case 'activeArea': {
      const { activeArea, email, lang } = payload;
      const { name, tags, receiveAlerts, changesEmail, monthlyEmail } =
        activeArea.attributes || activeArea || {};
      return {
        ...state,
        name,
        tags,
        email,
        receiveAlerts,
        lang,
        changesEmail,
        monthlyEmail
      };
    }
    default:
      return state;
  }
}

function SaveAOIForm(props) {
  const {
    activeArea,
    userData,
    saving,
    error,
    saveAOI,
    deleteAOI,
    viewAfterSave,
    clearAfterDelete,
    canDelete
  } = props;

  const [form, dispatch] = useReducer(reducer, {
    name: props.locationName || '',
    tags: [],
    email: props.email || '',
    emailError: false,
    nameError: false,
    receiveAlerts: false,
    lang: props.lang,
    changesEmail: true,
    monthlyEmail: true
  });

  useEffect(
    () => {
      if (activeArea) {
        dispatch({ type: 'activeArea', payload: { activeArea, lang, email } });
      }
    },
    [activeArea, lang, email]
  );

  const renderSaveAOI = () => {
    const disclaimer = error ? (
      <p className="error-message">
        This service is currently unavailable. Please try again later.
      </p>
    ) : (
      <p>You can always change these settings in MyGFW</p>
    );
    return (
      <div className="save-aoi">
        {canDelete && activeArea && activeArea.userArea ? (
          <Button
            className="delete-aoi"
            theme="theme-button-clear"
            onClick={() => deleteAOI({ id: activeArea.id, clearAfterDelete })}
          >
            <Icon icon={deleteIcon} className="delete-icon" />
            Delete Area
          </Button>
        ) : (
          disclaimer
        )}
        <Button
          className={cx('submit-btn', { error }, { saving })}
          onClick={() =>
            saveAOI({
              ...form,
              activeArea,
              userData,
              viewAfterSave
            })
          }
          disabled={!canSubmit}
        >
          {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
        </Button>
      </div>
    );
  };

  const {
    lang,
    name,
    email,
    tags,
    emailError,
    nameError,
    receiveAlerts,
    changesEmail,
    monthlyEmail
  } = form;
  const canSubmit = validateEmail(email) && name && lang;

  return (
    <div className="c-form c-save-aoi-form">
      <img
        className="area-image"
        src={placeholderAreaBg}
        alt="aoi screenshot"
      />
      <div className={cx('field', { error: nameError })}>
        <span className="form-title">Name this area for later reference</span>
        <input
          className="text-input"
          value={name}
          onChange={e => dispatch({ type: 'name', payload: e.target.value })}
        />
      </div>
      <div className={cx('field', { error: nameError })}>
        <span className="form-title">
          Assign tags to organize and group areas
        </span>
        <InputTags
          tags={tags}
          className="aoi-tags-input"
          onChange={newTags => dispatch({ type: 'tags', payload: newTags })}
        />
      </div>
      <div className={cx('field')}>
        <span className="form-toggle">
          <Toggle
            onToggle={() => dispatch({ type: 'receiveAlerts' })}
            value={receiveAlerts}
            theme="toggle-large"
          />
          <p className="form-title">
            Receive alert emails about deforestation in this area
          </p>
        </span>
      </div>
      {receiveAlerts && (
        <div>
          <div className={cx('field', 'field-image')}>
            <img
              src={screenImg1x}
              srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
              alt="aoi screenshot"
            />
            <p>
              We will send you email updates about alerts and forest cover
              change in your selected area.
            </p>
          </div>
          <div className={cx('field', { error: emailError })}>
            <span className="form-title">Email</span>
            <input
              className="text-input"
              value={email}
              onChange={e =>
                dispatch({ type: 'email', payload: e.target.value })
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
              onChange={newLang => dispatch({ type: 'lang', payload: newLang })}
              native
            />
          </div>
          <div className="field">
            <Checkbox
              className="form-checkbox"
              onChange={() => dispatch({ type: 'changesEmail' })}
              checked={changesEmail}
              label={'As soon as forest change is detected'}
            />
            <Checkbox
              className="form-checkbox"
              onChange={() => dispatch({ type: 'monthlyEmail' })}
              checked={monthlyEmail}
              label={'Monthly summary'}
            />
          </div>
        </div>
      )}
      {renderSaveAOI()}
    </div>
  );
}

SaveAOIForm.propTypes = {
  saveAOI: PropTypes.func,
  deleteAOI: PropTypes.func,
  userData: PropTypes.object,
  lang: PropTypes.string,
  locationName: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  activeArea: PropTypes.object,
  viewAfterSave: PropTypes.bool,
  clearAfterDelete: PropTypes.bool,
  canDelete: PropTypes.bool
};

export default SaveAOIForm;
