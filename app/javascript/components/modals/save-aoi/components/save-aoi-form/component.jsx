import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Checkbox from 'components/ui/checkbox-v2';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import InputTags from 'components/input-tags';
import MapGeostore from 'components/map-geostore';

import deleteIcon from 'assets/icons/delete.svg';
import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';

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
    case 'tags': {
      return {
        ...state,
        tags: payload
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
        webhookUrl: payload
      };
    }
    case 'activeArea': {
      const { activeArea } = payload;
      const {
        name,
        tags,
        fireAlerts,
        deforestationAlerts,
        monthlySummary,
        webhookUrl
      } =
        activeArea || {};

      return {
        ...state,
        name,
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
    geostoreId
  } = props;

  const [form, dispatch] = useReducer(reducer, {
    loading: true,
    name: props.locationName || '',
    tags: [],
    nameError: false,
    fireAlerts: props.fireAlerts || false,
    deforestationAlerts: props.deforestationAlerts || false,
    monthlySummary: props.monthlySummary || false,
    webhookUrl: props.webhookUrl || ''
  });

  useEffect(
    () => {
      if (activeArea) {
        dispatch({ type: 'activeArea', payload: { activeArea } });
      }
    },
    [activeArea]
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
    name,
    tags,
    nameError,
    fireAlerts,
    deforestationAlerts,
    monthlySummary,
    webhookUrl
  } = form;
  const canSubmit = name;

  return (
    <div className="c-form c-save-aoi-form">
      <MapGeostore
        className="aoi-map"
        geostoreId={(activeArea && activeArea.geostore) || geostoreId}
        padding={50}
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
        <span className="form-title">Add a webhook url</span>
        <input
          className="text-input"
          value={webhookUrl}
          onChange={e =>
            dispatch({ type: 'webhookUrl', payload: e.target.value })
          }
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
      <div className="field">
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'fireAlerts' })}
          checked={fireAlerts}
          label={'As soon as fires are detected'}
        />
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'deforestationAlerts' })}
          checked={deforestationAlerts}
          label={'As soon as forest change is detected'}
        />
        <Checkbox
          className="form-checkbox"
          onChange={() => dispatch({ type: 'monthlySummary' })}
          checked={monthlySummary}
          label={'Monthly summary'}
        />
      </div>
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
  saving: PropTypes.bool,
  activeArea: PropTypes.object,
  viewAfterSave: PropTypes.bool,
  clearAfterDelete: PropTypes.bool,
  canDelete: PropTypes.bool,
  fireAlerts: PropTypes.bool,
  deforestationAlerts: PropTypes.bool,
  monthlySummary: PropTypes.bool,
  webhookUrl: PropTypes.string,
  geostoreId: PropTypes.string
};

export default SaveAOIForm;
