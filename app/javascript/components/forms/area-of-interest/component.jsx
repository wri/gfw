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
import Submit from 'components/forms/components/submit';
import Thankyou from 'components/thankyou';
import Button from 'components/ui/button';
import MapGeostore from 'components/map-geostore';

import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';

import {
  email as validateEmail,
  validateURL
} from 'components/forms/validations';

import './styles.scss';

class ProfileForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    saveAreaOfInterest: PropTypes.func,
    setModalSources: PropTypes.func
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
    const { initialValues, saveAreaOfInterest, setModalSources } = this.props;
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
              <div className="row">
                {submitSucceeded ? (
                  <div className="column small-12">
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
                  </div>
                ) : (
                  <Fragment>
                    <div className="column small-12">
                      <h1>Save area of Interest</h1>
                    </div>
                    <div className="column small-12">
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
                    </div>
                    <div className="column small-12 medium-8">
                      <Input
                        name="name"
                        label="Name this area for later reference"
                        required
                      />
                      <InputTags
                        name="tags"
                        label="Assign tags to organize and group areas"
                      />
                    </div>
                    <div className="column small-12">
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
                    </div>
                    <div className="column small-12 medium-8">
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
                          {testingWebhook && (
                            <Loader className="webhook-loader" />
                          )}
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
                    </div>
                    <div className="column small-12">
                      <Submit
                        valid={valid}
                        submitting={submitting}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      >
                        save
                      </Submit>
                    </div>
                  </Fragment>
                )}
              </div>
            </form>
          )}
        />
        <ModalSource />
      </Fragment>
    );
  }
}

export default ProfileForm;
