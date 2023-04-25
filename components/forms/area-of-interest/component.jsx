import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { languages } from 'utils/lang';
import request from 'utils/request';

import { Loader } from '@worldresources/gfw-components';

import Input from 'components/forms/components/input';
import InputTags from 'components/forms/components/input-tags';
import Select from 'components/forms/components/select';
import Radio from 'components/forms/components/radio';
import Checkbox from 'components/forms/components/checkbox';
import Error from 'components/forms/components/error';
import Submit from 'components/forms/components/submit';

import Toggle from 'components/ui/toggle';

import ConfirmationMessage from 'components/confirmation-message';
import Button from 'components/ui/button';
import MapGeostore from 'components/map-geostore';
import Icon from 'components/ui/icon';

import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';
import deleteIcon from 'assets/icons/delete.svg?sprite';

import {
  email as validateEmail,
  validateURL,
} from 'components/forms/validations';

import WebhookModal from './webhook-modal';

const confirmations = {
  saved: {
    title: 'Your area has been saved',
    description: 'You can view all your areas in My GFW',
  },
  savedWithSub: {
    title: 'Your area has been saved',
    description:
      "<b>Check your email and click on the link to confirm your subscription.</b> If you don't see an email, check your junk or spam email folder.",
  },
  deleted: {
    title: 'This area has been deleted from your My GFW.',
    error: true,
  },
};

class AreaOfInterestForm extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    initialValues: PropTypes.object,
    saveAreaOfInterest: PropTypes.func,
    setModalSources: PropTypes.func,
    canDelete: PropTypes.bool,
    clearAfterDelete: PropTypes.bool,
    deleteAreaOfInterest: PropTypes.func,
    viewAfterSave: PropTypes.bool,
    closeForm: PropTypes.func,
  };

  state = {
    webhookModalOpen: false,
    webhookError: false,
    webhookSuccess: false,
    testingWebhook: false,
    deleted: false,
    publicArea: false,
  };

  componentDidMount() {
    const { initialValues } = this.props;
    const { publicArea } = this.state;
    if (initialValues?.public && initialValues.public !== publicArea) {
      this.setState({ publicArea: initialValues.public });
    }
  }

  testWebhook = (url) => {
    this.setState({
      webhookError: false,
      webhookSuccess: false,
      testingWebhook: true,
    });
    request({
      method: 'POST',
      url,
    })
      .then(() => {
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: true,
            testingWebhook: false,
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 2500);
      })
      .catch(() => {
        setTimeout(() => {
          this.setState({
            webhookError: true,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 2500);
      });
  };

  handleSaveAoi(values) {
    const { saveAreaOfInterest } = this.props;
    const out = { ...values };
    // TODO: What was this?
    // const { alerts } = values;
    // if (alerts.indexOf('deforestationAlerts') > -1) {
    //   out.deforestationAlerts = true;
    //   out.alerts = without(alerts, 'deforestationAlerts');
    // }
    saveAreaOfInterest(out);
  }

  render() {
    const {
      initialValues,
      deleteAreaOfInterest,
      clearAfterDelete,
      canDelete,
      viewAfterSave,
      title,
      closeForm,
    } = this.props;
    const {
      webhookModalOpen,
      webhookError,
      webhookSuccess,
      testingWebhook,
      deleted,
      publicArea,
    } = this.state;

    return (
      <Fragment>
        <Form
          onSubmit={(values) =>
            this.handleSaveAoi({
              ...initialValues,
              ...values,
              publicArea,
              viewAfterSave,
            })
          }
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded,
            values: { webhookUrl, alerts },
            errors: { webhookUrl: webhookInputError },
          }) => {
            let metaKey = 'saved';
            if (alerts && !!alerts.length) metaKey = 'savedWithSub';
            if (deleted && initialValues && !initialValues.id) {
              metaKey = 'deleted';
            }
            const confirmationMeta = confirmations[metaKey];

            return (
              <form className="c-area-of-interest-form" onSubmit={handleSubmit}>
                {submitSucceeded || deleted ? (
                  <Fragment>
                    <ConfirmationMessage {...confirmationMeta} />
                    <Button
                      className="reset-form-btn"
                      onClick={(e) => {
                        // stops button click triggering another submission of the form
                        e.preventDefault();
                        e.stopPropagation();
                        closeForm();
                      }}
                    >
                      Back to my areas
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h1>{title}</h1>
                    <MapGeostore
                      className="aoi-map"
                      location={initialValues && initialValues.location}
                      padding={50}
                      height={300}
                      width={700}
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
                        src={screenImg1x.src}
                        srcSet={`${screenImg1x.src} 1x, ${screenImg2x.src} 2x`}
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
                        this.setState({ webhookModalOpen: true })
                      }
                      collapse
                    />
                    <div className="webhook-actions">
                      <button
                        className="test-webhook"
                        onClick={(e) => {
                          e.preventDefault();
                          this.testWebhook(webhookUrl);
                        }}
                      >
                        {webhookUrl &&
                          !webhookInputError &&
                          !webhookError &&
                          !webhookSuccess && <span>Test webhook</span>}
                        {testingWebhook && (
                          <Loader className="webhook-loader" />
                        )}
                        {!testingWebhook && webhookError && (
                          <span className="wh-error">
                            POST error. Check the URL or CORS policy.
                          </span>
                        )}
                        {!testingWebhook && webhookSuccess && (
                          <span className="wh-success">Success!</span>
                        )}
                      </button>
                    </div>
                    <Checkbox
                      name="alerts"
                      formState={alerts}
                      label="Would you like to receive alert notifications?"
                      options={[
                        {
                          label: 'As soon as fires are detected',
                          value: 'fireAlerts',
                        },
                        {
                          label: 'As soon as forest change is detected',
                          value: 'deforestationAlerts',
                          multiInput: true,
                        },
                        {
                          label: 'Monthly summary',
                          value: 'monthlySummary',
                        },
                      ]}
                    >
                      {(option) => {
                        if (option.value === 'deforestationAlerts') {
                          return (
                            <Radio
                              name="deforestationAlertsType"
                              options={[
                                { label: 'All alerts', value: 'glad-all' },
                                { label: 'GLAD-L alerts', value: 'glad-l' },
                                { label: 'GLAD-S2 alerts', value: 'glad-s2' },
                                { label: 'RADD alerts', value: 'glad-radd' },
                              ]}
                            />
                          );
                        }
                        return null;
                      }}
                    </Checkbox>
                    <Select
                      name="language"
                      label="language"
                      options={languages}
                      placeholder="Select a language"
                      required
                    />
                    <div className="public-area-field">
                      <span
                        tabIndex={0}
                        role="button"
                        onClick={() =>
                          this.setState({ publicArea: !publicArea })
                        }
                      >
                        <Toggle
                          theme="toggle-large"
                          value={publicArea}
                          onToggle={(value, event) => {
                            event.preventDefault();
                            this.setState({ publicArea: !publicArea });
                          }}
                        />
                        Make this area public
                      </span>
                      <p>
                        You need to make your area public before sharing. Public
                        areas can be viewed by anyone with the URL; private
                        areas can only be viewed by the area&apos;s creator.
                      </p>
                    </div>
                    <Error
                      valid={valid}
                      submitFailed={submitFailed}
                      submitError={submitError}
                    />
                    <div className="submit-actions">
                      <Submit className="area-submit" submitting={submitting}>
                        save
                      </Submit>
                      {canDelete && initialValues && initialValues.id && (
                        <Button
                          className="delete-area"
                          theme="theme-button-clear"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteAreaOfInterest({
                              id: initialValues.id,
                              clearAfterDelete,
                              callBack: () => this.setState({ deleted: true }),
                            });
                          }}
                        >
                          <Icon icon={deleteIcon} className="delete-icon" />
                          Delete Area
                        </Button>
                      )}
                    </div>
                  </Fragment>
                )}
              </form>
            );
          }}
        />
        <WebhookModal
          open={webhookModalOpen}
          onRequestClose={() => this.setState({ webhookModalOpen: false })}
        />
      </Fragment>
    );
  }
}

export default AreaOfInterestForm;
