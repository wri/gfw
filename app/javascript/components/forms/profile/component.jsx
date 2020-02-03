import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import isEmpty from 'lodash/isEmpty';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Checkbox from 'components/forms/components/checkbox';
import Radio from 'components/forms/components/radio';
import Submit from 'components/forms/components/submit';
import ConfirmationMessage from 'components/confirmation-message';
import Button from 'components/ui/button';
import Error from 'components/forms/components/error';

import { email as validateEmail } from 'components/forms/validations';

import { sectors, howDoYouUse, interests, topics } from './config';

import './styles.scss';

class ProfileForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    countries: PropTypes.array,
    saveProfile: PropTypes.func
  };

  render() {
    const { initialValues, countries, saveProfile } = this.props;

    return (
      <Fragment>
        <Form
          onSubmit={saveProfile}
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded,
            form: { reset },
            values
          }) => (
            <form className="c-profile-form" onSubmit={handleSubmit}>
              <div className="row">
                {submitSucceeded ? (
                  <div className="column small-12">
                    <ConfirmationMessage
                      title="Thank you for updating your My GFW profile!"
                      description="You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
                    />
                    <Button
                      className="reset-form-btn"
                      onClick={() => {
                        reset();
                      }}
                    >
                      Back to my profile
                    </Button>
                  </div>
                ) : (
                  <Fragment>
                    <div className="column small-12">
                      <h1>Your profile information</h1>
                      <h3>
                        Help us help you! Tell us who you are and how you use
                        Global Forest Watch so we can better meet your needs.
                      </h3>
                    </div>
                    <div className="column small-12 medium-6">
                      <Input name="firstName" label="first name" required />
                      <Input name="lastName" label="last name" required />
                      <Input
                        name="email"
                        type="email"
                        label="email"
                        placeholder="example@globalforestwatch.org"
                        validate={[validateEmail]}
                        required
                      />
                      <Select
                        name="sector"
                        label="sector"
                        options={Object.keys(sectors).map(s => ({
                          label: s,
                          value: s
                        }))}
                        placeholder="Select a sector"
                      />
                      {values.sector && (
                        <Radio
                          name="subsector"
                          label="Role"
                          options={sectors[values.sector].map(s => ({
                            label: s,
                            value: s.replace(/( )+|(\/)+/g, '_')
                          }))}
                          selectedOption={values.subsector}
                        />
                      )}
                      <Input name="jobTitle" label="job title" />
                      <Input name="company" label="Company / organization" />
                      <h4>Location</h4>
                      <Select
                        name="country"
                        label="country"
                        options={countries}
                        placeholder="Select a country"
                      />
                      <Input name="city" label="city" />
                      <Input
                        name="state"
                        label="state / department / province"
                      />
                      <h4>Geographic area of interest *</h4>
                      <Select
                        name="aoi-country"
                        label="country"
                        options={countries}
                        placeholder="Select a country"
                        required
                      />
                      <Input name="aoi-city" label="city" required />
                      <Input
                        name="aoi-state"
                        label="state / department / province"
                        required
                      />
                    </div>
                    <div className="column small-12 medium-6">
                      <Select
                        name="interests"
                        label="What topics are you interested in? Select all that apply."
                        options={interests.map(interest => ({
                          label: interest,
                          value: interest.replace(/( )+|(\/)+/g, '_')
                        }))}
                        required
                        multiple
                      />
                      <Select
                        name="howDoYouUse"
                        label="how do you plan to use global forest watch? (select all that apply)"
                        options={howDoYouUse.map(r => ({ label: r, value: r }))}
                        multiple
                      />
                      <Checkbox
                        name="signUpForTesting"
                        options={[
                          {
                            label:
                              'Interested in testing new features and helping to improve Global Forest Watch? Sign up to become an official tester!',
                            value: 'yes'
                          }
                        ]}
                      />
                      <Checkbox
                        name="signUpToNewsletter"
                        options={[
                          {
                            label:
                              'Subscribe to the newsletter to receive GFW updates',
                            value: 'yes'
                          }
                        ]}
                      />
                      {!isEmpty(values.signUpToNewsletter) && (
                        <Select
                          name="topics"
                          label="Topics you're interested in receiving communications about"
                          options={topics.map(s => ({
                            label: s,
                            value: s.replace(/( )+|(\/)+/g, '_')
                          }))}
                          required
                          multiple
                        />
                      )}
                      <Error
                        valid={valid}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      />
                      <Submit submitting={submitting}>save</Submit>
                    </div>
                    <div className="column small-12">
                      <p className="delete-profile">
                        If you wish to delete your My GFW account, please{' '}
                        <a href="mailto:gfw@wri-org">email us</a>.
                      </p>
                    </div>
                  </Fragment>
                )}
              </div>
            </form>
          )}
        />
        <CountryDataProvider />
      </Fragment>
    );
  }
}

export default ProfileForm;
