import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { getLanguages } from 'utils/lang';
import request from 'utils/request';

import ModalSource from 'components/modals/sources';
import Loader from 'components/ui/loader';
import Input from 'components/forms/components/input';
import InputTags from 'components/forms/components/input-tags';
import Select from 'components/forms/components/select';
import Checkbox from 'components/forms/components/checkbox';
import Error from 'components/forms/components/error';
import Submit from 'components/forms/components/submit';
import Thankyou from 'components/thankyou';
import Button from 'components/ui/button';
import MapGeostore from 'components/map-geostore';
import Icon from 'components/ui/icon';

import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';
import deleteIcon from 'assets/icons/delete.svg';

import {
  email as validateEmail,
  validateURL
} from 'components/forms/validations';

import './styles.scss';

class ProfileForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    saveAreaOfInterest: PropTypes.func,
    setModalSources: PropTypes.func,
    canDelete: PropTypes.bool,
    clearAfterDelete: PropTypes.bool,
    deleteArea: PropTypes.func
  };

  state = {
    webhookError: false,
    webhookSuccess: false,
    testingWebhook: false
  };

  testWebhook = url => {
    this.setState({
      webhookError: false,
      webhookSuccess: false,
      testingWebhook: true
    });
    request({
      method: 'POST',
      url
    })
      .then(() => {
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: true,
            testingWebhook: false
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false
          });
        }, 2500);
      })
      .catch(() => {
        setTimeout(() => {
          this.setState({
            webhookError: true,
            webhookSuccess: false,
            testingWebhook: false
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false
          });
        }, 2500);
      });
  };

  render() {
    const {
      initialValues,
      saveAreaOfInterest,
      deleteArea,
      clearAfterDelete,
      setModalSources,
      canDelete
    } = this.props;
    const { webhookError, webhookSuccess, testingWebhook } = this.state;

    return (
      <Fragment>
        <Form
          onSubmit={saveAreaOfInterest}
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded,
            form: { reset },
            values: { webhookUrl }
          }) => (
            <form className="c-area-of-interest-form" onSubmit={handleSubmit}>
              {submitSucceeded ? (
                <Fragment>
                  <Thankyou
                    title="Your area of interest has been saved!"
                    description="Your area has been updated. You can view all your areas in My GFW."
                  />
                  <Button
                    className="reset-form-btn"
                    onClick={() => {
                      reset();
                    }}
                  >
                    Back to my areas
                  </Button>
                </Fragment>
              ) : (
                <Fragment>
                  <h1>Save area of Interest</h1>
                  <MapGeostore
                    className="aoi-map"
                    location={
                      initialValues &&
                      initialValues.geostore && {
                        type: 'geostore',
                        adm0: initialValues.geostore
                      }
                    }
                    padding={50}
                    height={300}
                    width={600}
                  />
                  <Input
                    name="name"
                    label="Name this area for later reference"
                    required
                  />
                  <InputTags
                    name="tags"
                    label="Assign tags to organize and group areas"
                  />
                  <div className="alerts-image">
                    <img
                      src={screenImg1x}
                      srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
                      alt="area of interest alerts"
                    />
                    <p>
                      We will send you email updates about alerts and forest
                      cover change in your selected area, based on your user
                      profile.
                    </p>
                  </div>
                  <Input
                    name="email"
                    type="email"
                    label="email"
                    placeholder="example@globalforestwatch.org"
                    validate={[validateEmail]}
                    required
                  />
                  <Input
                    name="webhookUrl"
                    label="Webhook URL (Optional)"
                    type="text"
                    placeholder="https://my-webhook-url.com"
                    validate={[validateURL]}
                    infoClick={() =>
                      setModalSources({
                        open: true,
                        source: 'webhookPreview'
                      })
                    }
                    collapse
                  />
                  <div className="webhook-actions">
                    <button
                      className="test-webhook"
                      onClick={e => {
                        e.preventDefault();
                        this.testWebhook(webhookUrl);
                      }}
                    >
                      {!webhookError &&
                        !webhookSuccess && <span>Test webhook</span>}
                      {testingWebhook && <Loader className="webhook-loader" />}
                      {!testingWebhook &&
                        webhookError && (
                        <span className="wh-error">
                            POST error. Check the URL or CORS policy.
                        </span>
                      )}
                      {!testingWebhook &&
                        webhookSuccess && (
                        <span className="wh-success">Success!</span>
                      )}
                    </button>
                  </div>
                  <Select
                    name="language"
                    label="language"
                    options={getLanguages()}
                    placeholder="Select a language"
                    required
                  />
                  <Checkbox
                    name="signUpForTesting"
                    label="Would you like to recieve alert notifications?"
                    options={[
                      {
                        label: 'As soon as fires are detected',
                        value: 'fireAlerts'
                      },
                      {
                        label: 'As soon as forest change is detected',
                        value: 'deforestationAlerts'
                      },
                      {
                        label: 'Monthly summary',
                        value: 'monthlySummary'
                      }
                    ]}
                  />
                  <Error
                    valid={valid}
                    submitFailed={submitFailed}
                    submitError={submitError}
                  />
                  <div className="submit-actions">
                    <Submit className="area-submit" submitting={submitting}>
                      save
                    </Submit>
                    {canDelete ? (
                      <Button
                        className="delete-area"
                        theme="theme-button-clear"
                        onClick={() =>
                          deleteArea({
                            subscriptionId: initialValues.subscriptionId,
                            id: initialValues.id,
                            clearAfterDelete
                          })
                        }
                      >
                        <Icon icon={deleteIcon} className="delete-icon" />
                        Delete Area
                      </Button>
                    ) : (
                      'disclaimer'
                    )}
                  </div>
                </Fragment>
              )}
            </form>
          )}
        />
        <ModalSource />
      </Fragment>
    );
  }
}

export default ProfileForm;
