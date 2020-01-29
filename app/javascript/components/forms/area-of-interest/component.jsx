import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { getLanguages } from 'utils/lang';

import ModalSource from 'components/modals/sources';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Checkbox from 'components/forms/components/checkbox';
import Submit from 'components/forms/components/submit';
import Thankyou from 'components/thankyou';
import Button from 'components/ui/button';
import MapGeostore from 'components/map-geostore';
import Icon from 'components/ui/icon';

import screenImg1x from 'assets/images/aois/alert-email.png';
import screenImg2x from 'assets/images/aois/alert-email@2x.png';
import infoIcon from 'assets/icons/info.svg';

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

  render() {
    const { initialValues, saveAreaOfInterest, setModalSources } = this.props;

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
            form: { reset }
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
                      <details
                        open={!!initialValues && initialValues.webhookUrl}
                      >
                        <summary>
                          <span>Webhook URL (Optional)</span>
                          <Button
                            className="info-button"
                            theme="theme-button-tiny theme-button-grey-filled square"
                            onClick={e => {
                              e.preventDefault();
                              setModalSources({
                                open: true,
                                source: 'webhookPreview'
                              });
                            }}
                          >
                            <Icon icon={infoIcon} className="info-icon" />
                          </Button>
                        </summary>
                        <Input
                          name="webhookUrl"
                          type="text"
                          placeholder="https://my-webhook-url.com"
                          validate={[validateURL]}
                        />
                        {/* <div className="webhook-actions">
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
                        </div> */}
                      </details>
                      <Select
                        name="language"
                        label="language"
                        options={getLanguages()}
                        placeholder="Select a language"
                        required
                      />
                      <Checkbox
                        name="signUpForTesting"
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
