import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { submitNewsletterSubscription } from 'services/forms';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Submit from 'components/forms/components/submit';
import SuccessMessage from 'components/success-message';
import Error from 'components/forms/components/error';

import { email as validateEmail } from 'components/forms/validations';

const sectors = [
  'Government',
  'Donor Institution/Agency',
  'Local NGO (National or Subnational)',
  'International NGO',
  'UN or International Organization',
  'Academic/Research Organization',
  'Journalist/Media Organization',
  'Indigenous or Community-Based Organization',
  'Private Sector',
  'No Affiliation',
  'Other',
];

const preferredLanguages = [
  'English',
  'Français',
  'Español',
  'Português',
  'Bahasa Indonesia',
];

const interests = [
  'Innovations in Monitoring',
  'Fires',
  'Forest Watcher Mobile App',
  'Climate and Carbon',
  'Biodiversity',
  'Agricultural Supply Chains',
  'Small Grants Fund and Tech Fellowship',
  'Landscape Restoration',
  'GFW Users in Action',
  'Places to Watch alerts',
];

class NewsletterForm extends PureComponent {
  static propTypes = {
    countries: PropTypes.array,
    initialValues: PropTypes.object,
  };

  saveNewsletterSubscription = (values) => {
    const {
      email,
      firstName,
      lastName,
      jobTitle,
      organization,
      city,
      country,
      sector,
      interest,
    } = values;

    const postData = {
      email,
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      company: organization,
      city,
      country,
      sectors: sector,
      interests: interest,
    };

    return submitNewsletterSubscription(postData)
      .then(() => {})
      .catch((error) => {
        if (!error.response) {
          return true;
        }

        return {
          [FORM_ERROR]: 'Service unavailable',
        };
      });
  };

  render() {
    const { countries, initialValues } = this.props;

    const countriesOptions = countries.map(({ label }) => ({
      label,
      value: label,
    }));
    const sectorsOptions = sectors.map((sector) => ({
      label: sector,
      value: sector,
    }));
    const interestsOptions = interests.map((interest) => ({
      label: interest,
      value: interest,
    }));
    const preferredLanguageOptions = preferredLanguages.map(
      (preferredLanguage) => ({
        label: preferredLanguage,
        value: preferredLanguage,
      })
    );

    return (
      <Fragment>
        <Form
          onSubmit={this.saveNewsletterSubscription}
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded,
          }) => (
            <form className="c-newsletter-form" onSubmit={handleSubmit}>
              {submitSucceeded ? (
                <SuccessMessage
                  title="Thank you for subscribing to Global Forest Watch newsletters and updates!"
                  description="You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
                />
              ) : (
                <Fragment>
                  <h1>Stay Updated on the World&apos;s Forests</h1>
                  <h3>
                    Subscribe to monthly GFW newsletters and updates based on
                    your interests.
                  </h3>
                  <Input
                    name="email"
                    type="email"
                    label="email"
                    placeholder="example@globalforestwatch.org"
                    validate={[validateEmail]}
                    required
                  />
                  <Input name="firstName" label="first name" required />
                  <Input name="lastName" label="last name" required />
                  <Input name="jobTitle" label="job title" />
                  <Input name="organization" label="organization" required />
                  <Input name="city" label="city" />
                  <Select
                    name="country"
                    label="country"
                    options={countriesOptions}
                    placeholder="Select a country"
                    required
                  />
                  <Select
                    name="sector"
                    label="sector"
                    options={sectorsOptions}
                    placeholder="Select a sector"
                    required
                  />
                  <Select
                    name="interest"
                    label="Preferred Language"
                    options={preferredLanguageOptions}
                  />
                  <Select
                    name="interest"
                    label="I'm interested in"
                    description="Please note that most communications will be sent in English."
                    options={interestsOptions}
                    multiple
                  />
                  <Error
                    valid={valid}
                    submitFailed={submitFailed}
                    submitError={submitError}
                  />
                  <Submit submitting={submitting}>subscribe</Submit>
                </Fragment>
              )}
            </form>
          )}
        />
        <CountryDataProvider />
      </Fragment>
    );
  }
}

export default NewsletterForm;
