/* eslint-disable jsx-a11y/label-has-for */
import React, { useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getLanguages } from 'utils/lang';
import { validateEmail, validateURL } from 'utils/format';

import Checkbox from 'components/ui/checkbox-v2';
import Loader from 'components/ui/loader';
import Dropdown from 'components/ui/dropdown';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import InputTags from 'components/input-tags';
import MapGeostore from 'components/map-geostore';
import deleteIcon from 'assets/icons/delete.svg';
import infoIcon from 'assets/icons/info.svg';
import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';
import ModalSource from 'components/modals/sources';

import './styles.scss';

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
    case 'tags': {
      return {
        ...state,
        tags: payload
      };
    }
    case 'language': {
      return {
        ...state,
        language: payload
      };
    }
    case 'fireAlerts': {
      return {
        ...state,
        fireAlerts: !state.fireAlerts
      };
    }
    case 'deforestationAlerts': {
      return {
        ...state,
        deforestationAlerts: !state.deforestationAlerts
      };
    }
    case 'monthlySummary': {
      return {
        ...state,
        monthlySummary: !state.monthlySummary
      };
    }
    case 'webhookUrl': {
      return {
        ...state,
        webhookUrl: payload,
        webhookError: !validateURL(payload)
      };
    }
    case 'activeArea': {
      const { activeArea, userData } = payload;
      const {
        name,
        tags,
        fireAlerts,
        deforestationAlerts,
        monthlySummary,
        webhookUrl,
        email,
        language
      } =
        activeArea || {};
      const { email: userEmail, language: userLang } = userData || {};

      return {
        ...state,
        name,
        email: email || userEmail,
        language: language || userLang || 'en',
        tags,
        fireAlerts,
        deforestationAlerts,
        monthlySummary,
        webhookUrl
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
    canDelete,
    geostoreId,
    setModalSources,
    testWebhook
  } = props;

  const [form, dispatch] = useReducer(reducer, {
    loading: true,
    name: props.locationName || '',
    email: props.email || userData.email,
    emailError: false,
    language: props.language || userData.language || 'en',
    tags: [],
    nameError: false,
    fireAlerts: props.fireAlerts || false,
    deforestationAlerts: props.deforestationAlerts || false,
    monthlySummary: props.monthlySummary || false,
    webhookUrl: props.webhookUrl || '',
    webhookError: false
  });

  useEffect(
    () => {
      if (activeArea) {
        dispatch({ type: 'activeArea', payload: { activeArea, userData } });
      }
    },
    [activeArea, userData]
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
            onClick={() =>
              deleteAOI({
                subscriptionId: activeArea.subscriptionId,
                id: activeArea.id,
                clearAfterDelete
              })
            }
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
    name,
    nameError,
    email,
    emailError,
    tags,
    language,
    fireAlerts,
    deforestationAlerts,
    monthlySummary,
    webhookUrl,
    webhookError
  } = form;
  const hasSubscription = fireAlerts || deforestationAlerts || monthlySummary;
  const canSubmit =
    (hasSubscription ? validateEmail(email) : true) &&
    name &&
    language &&
    (!webhookUrl || !webhookError);

  const webhookData = { test: true };
  const [webhookMsg, setWebhookMsg] = useState(null);
  const [showLoader, setLoader] = useState(false);

  return (
    <div className="c-form c-save-aoi-form">
      <MapGeostore
        className="aoi-map"
        location={
          (activeArea && activeArea.location) || {
            type: 'geostore',
            adm0: geostoreId
          }
        }
        padding={50}
        height={300}
        width={600}
      />
      <div className={cx('field', { error: nameError })}>
        <label className="form-title">Name this area for later reference</label>
        <input
          className="text-input"
          value={name}
          onChange={e => dispatch({ type: 'name', payload: e.target.value })}
        />
      </div>
      <div className={cx('field', { error: nameError })}>
        <label className="form-title">
          Assign tags to organize and group areas
        </label>
        <InputTags
          tags={tags}
          className="aoi-tags-input"
          onChange={newTags => dispatch({ type: 'tags', payload: newTags })}
        />
      </div>
      <div className={cx('field', 'field-image')}>
        <img
          src={screenImg1x}
          srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
          alt="aoi screenshot"
        />
        <p>
          We will send you email updates about alerts and forest cover change in
          your selected area, based on your user profile.
        </p>
      </div>
      <div className={cx('field', { error: emailError })}>
        <label className="form-title">Email</label>
        <input
          className="text-input"
          value={email}
          onChange={e => dispatch({ type: 'email', payload: e.target.value })}
        />
      </div>
      <div className={cx('field', { error: webhookError })}>
        <details open={!!webhookUrl}>
          <summary>
            <label className="form-title">
              Webhook URL (Optional)
              <Button
                className="info-button"
                theme="theme-button-tiny theme-button-grey-filled square"
                onClick={() =>
                  setModalSources({
                    open: true,
                    source: 'webhookPreview'
                  })
                }
              >
                <Icon icon={infoIcon} className="info-icon" />
              </Button>
            </label>
          </summary>
          <input
            className="text-input"
            value={webhookUrl}
            onChange={e =>
              dispatch({ type: 'webhookUrl', payload: e.target.value })
            }
          />
          <div className="webhook-actions">
            {!!webhookUrl &&
              !webhookError && (
              <button
                className="button-link"
                onClick={() => {
                  setLoader(true);
                  testWebhook({
                    data: webhookData,
                    url: webhookUrl,
                    callback: message => {
                      // message is 'success' / 'error'
                      setTimeout(() => {
                        setLoader(false);
                        setWebhookMsg(message);
                      }, 300);
                      setTimeout(
                        () => setWebhookMsg(null),
                        message === 'error' ? 2500 : 1000
                      );
                    }
                  });
                }}
              >
                <span>Test webhook</span>
                {showLoader && <Loader className="webhook-loader" />}
              </button>
            )}
            {webhookMsg && (
              <span
                className={cx({
                  'wh-error': webhookMsg === 'error',
                  'wh-success': webhookMsg === 'success'
                })}
              >
                {webhookMsg === 'success' && 'Success!'}
                {webhookMsg === 'error' &&
                  'POST error. Check the URL or CORS policy.'}
              </span>
            )}
          </div>
        </details>
      </div>
      <div className="field">
        <label className="form-title">Language*</label>
        <Dropdown
          className="dropdown-input"
          theme="theme-dropdown-native-form"
          options={getLanguages()}
          value={language}
          onChange={newLang => dispatch({ type: 'language', payload: newLang })}
          native
        />
      </div>
      <div className="field">
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'fireAlerts' })}
          checked={fireAlerts}
          label={'As soon as fires are detected'}
          subLabel="Data updated daily"
        />
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'deforestationAlerts' })}
          checked={deforestationAlerts}
          label={'As soon as forest change is detected'}
          subLabel="Data updated weekly for the tropics, annual outside the tropics"
        />
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'monthlySummary' })}
          checked={monthlySummary}
          label={'Monthly summary'}
        />
      </div>
      <ModalSource />
      {renderSaveAOI()}
    </div>
  );
}

SaveAOIForm.propTypes = {
  saveAOI: PropTypes.func,
  deleteAOI: PropTypes.func,
  userData: PropTypes.object,
  locationName: PropTypes.string,
  error: PropTypes.bool,
  language: PropTypes.string,
  saving: PropTypes.bool,
  activeArea: PropTypes.object,
  viewAfterSave: PropTypes.bool,
  clearAfterDelete: PropTypes.bool,
  canDelete: PropTypes.bool,
  fireAlerts: PropTypes.bool,
  deforestationAlerts: PropTypes.bool,
  monthlySummary: PropTypes.bool,
  webhookUrl: PropTypes.string,
  email: PropTypes.string,
  geostoreId: PropTypes.string,
  setModalSources: PropTypes.func,
  testWebhook: PropTypes.func
};

export default SaveAOIForm;
