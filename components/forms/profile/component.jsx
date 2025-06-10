import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import sortBy from 'lodash/sortBy';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';

import Checkbox from 'components/forms/components/checkbox';
import Radio from 'components/forms/components/radio';

import Submit from 'components/forms/components/submit';
import ConfirmationMessage from 'components/confirmation-message';
import Button from 'components/ui/button';
import Error from 'components/forms/components/error';
import { preferredLanguages } from 'components/forms/profile/config';

import {
  email as validateEmail,
  hasValidOption,
} from 'components/forms/validations';

import { sectors, howDoYouUse, interests } from './config';

class ProfileForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    countries: PropTypes.array,
    saveProfile: PropTypes.func,
    source: PropTypes.string,
  };

  render() {
    const { initialValues, countries, saveProfile, source } = this.props;
    const sectorsOptions = Object.keys(sectors).map((s) => ({
      label: s,
      value: s,
    }));

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
            values = {},
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
                      <h1>Your profile</h1>
                      <h3>
                        We use this information to make Global Forest Watch more
                        useful for you. Your privacy is important to us and
                        we&apos;ll never share your information without your
                        consent.
                      </h3>
                    </div>
                    <div className="column small-12">
                      <Input name="firstName" label="first name" />
                      <Input
                        name="lastName"
                        label="last name / surname"
                        required
                      />
                      <Input
                        name="email"
                        type="email"
                        label="email"
                        placeholder="example@globalforestwatch.org"
                        validate={[validateEmail]}
                        required
                      />
                      <Input
                        name="old_email"
                        type="hidden"
                        value={initialValues.old_email}
                      />
                      <Checkbox
                        name="receive_updates"
                        label="WOULD YOU LIKE TO RECEIVE UPDATES ON NEWS AND EVENTS FROM GLOBAL FOREST WATCH?"
                        options={[{ label: 'Yes', value: 'true' }]}
                      />
                      <Select
                        name="sector"
                        label="sector"
                        options={sectorsOptions}
                        placeholder="Select a sector"
                        validate={[
                          (value) => hasValidOption(value, sectorsOptions),
                        ]}
                        required
                      />
                      {values.sector && sectors[values.sector] && (
                        <Radio
                          name="subsector"
                          label="Role"
                          options={sectors[values.sector].map((s) => ({
                            label: s,
                            value: s.replace(/( )+|(\/)+/g, '_'),
                            radioInput: s === 'Other:',
                          }))}
                          selectedOption={values.subsector}
                          required
                        />
                      )}
                      <Input name="jobTitle" label="job title" />
                      <Input
                        name="company"
                        label="Company / organization"
                        required
                      />
                      <p className="section-name">Where are you located?</p>
                      <Select
                        name="country"
                        label="country"
                        options={countries}
                        placeholder="Select a country"
                        required
                      />
                      <Input name="city" label="city" />
                      <Input
                        name="state"
                        label="state / department / province"
                      />
                      <p className="section-name">
                        What area are you most interested in?
                      </p>
                      <Select
                        name="aoiCountry"
                        label="country"
                        options={countries}
                        placeholder="Select a country"
                      />
                      <Input
                        name="areaOrRegionOfInterest"
                        label="Other area or region of interest"
                      />
                      <Checkbox
                        name="interests"
                        label="What topics are you interested in?"
                        multiple
                        required
                        options={interests.map((r) => ({
                          label: r,
                          value: r.replace(/( )+|(\/)+/g, '_').toLowerCase(),
                        }))}
                      />
                      <Select
                        name="preferred_language"
                        label="Preferred Language"
                        description="Please note that most communications will be sent in English."
                        placeholder="Select a preferred language"
                        options={preferredLanguages}
                      />
                      <Checkbox
                        name="howDoYouUse"
                        label="How do you use global forest watch?"
                        multiple
                        required
                        options={[
                          ...sortBy(
                            howDoYouUse.map((r) => ({
                              label: r,
                              value: r,
                            })),
                            'label'
                          ),
                          { label: 'Other', value: 'Other' },
                        ]}
                        selectInput={
                          values.howDoYouUse &&
                          values.howDoYouUse.includes('Other')
                        }
                      />
                      {/* <Checkbox
                        name="signUpToNewsletter"
                        options={[
                          {
                            label:
                              'Subscribe to monthly GFW newsletters and updates based on your interests.',
                            value: true
                          }
                        ]}
                      />
                      {values.signUpToNewsletter && (
                        <Select
                          name="topics"
                          label="I’m interested in receiving communications about"
                          options={topics}
                          required
                          multiple
                        />
                      )} */}
                      <Checkbox
                        name="signUpForTesting"
                        label="Would you like to help us test new application features?"
                        options={[{ label: 'Yes', value: 'true' }]}
                      />
                      <Error
                        valid={valid}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      />
                      <Submit submitting={submitting}>
                        {source === 'AreaOfInterestModal' ? 'next' : 'save'}
                      </Submit>
                    </div>
                    <div className="column small-12">
                      <p className="delete-profile">
                        <a href="mailto:gfw@wri.org">Email us </a>
                        to delete your MyGFW account.
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
