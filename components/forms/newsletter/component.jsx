import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
// import { FORM_ERROR } from 'final-form';
import axios from 'axios';

import { submitNewsletterSubscription } from 'services/forms';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Submit from 'components/forms/components/submit';
import SuccessMessage from 'components/success-message';
import Error from 'components/forms/components/error';
import { preferredLanguages, interests } from 'components/forms/profile/config';

import { email as validateEmail } from 'components/forms/validations';
import { ORTTO_REQUESTS_TYPES } from 'pages/api/ortto/constants';
import Checkbox from '../components/checkbox/component';

const sectors = [
  { value: 'Government', label: 'Government/Public Sector' },
  { value: 'Donor Institution / Agency', label: 'Philantropic Organization' },
  {
    value: 'Local NGO (national or subnational)',
    label: 'NGO - National or Local',
  },
  { value: 'International NGO', label: 'International NGO' },
  {
    value: 'Intergovernmental/Multilateral Organization',
    label: 'UN or International Organization',
  },
  {
    value: 'Academic / Research Organization',
    label: 'Academic/Research Organization',
  },
  {
    value: 'Journalist / Media Organization',
    label: 'Journalist/Media Organization',
  },
  {
    value: 'Indigenous or Community-Based Organization',
    label: 'Indigenous or Community-Based Organization',
  },
  { value: 'Private Sector', label: 'Business/Private sector' },
  { value: 'Individual / No Affiliation', label: 'No Affiliation' },
  { value: 'Other', label: 'Other (Write In)' },
];

class NewsletterForm extends PureComponent {
  static propTypes = {
    countries: PropTypes.array,
    initialValues: PropTypes.object,
  };

  saveNewsletterSubscription = async (values) => {
    const ipAddress = await fetch('https://api.ipify.org/?format=json')
      .then((response) => response.json())
      .then((data) => data?.ip);

    const {
      email,
      firstName,
      lastName,
      jobTitle,
      organization,
      city,
      country,
      sector,
      language,
      interest,
    } = values;

    const postData = {
      email,
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      organization,
      city,
      country,
      sector,
      preferred_language: language,
      interest: (interest || []).join(),
      person_source_details: 'https://www.globalforestwatch.org',
      ip_address: ipAddress,
    };

    try {
      await submitNewsletterSubscription(postData);
      await axios.post('/api/ortto', {
        ...postData,
        source: ORTTO_REQUESTS_TYPES.SUBSCRIBE_FORM,
      });

      window.location.href = '/thank-you';
      return true;
    } catch (error) {
      window.location.href = '/thank-you';
      return true;
      // return {
      //   [FORM_ERROR]: 'Service unavailable',
      // };
    }
  };

  render() {
    const { countries, initialValues } = this.props;

    const countriesOptions = countries.map(({ label }) => ({
      label,
      value: label,
    }));

    const sectorsOptions = sectors.map(({ label, value }) => ({
      label,
      value,
    }));

    const interestsOptions = interests.map((interest) => ({
      label: interest,
      value: interest,
    }));
    const preferredLanguageOptions = preferredLanguages.map(
      ({ label, value }) => ({ label, value })
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
                  title="Thank you!<br />You aren't done yet."
                  description="<p>Please check your inbox for an email<br /> and click the button to confirm your subscription.</p><p>You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data.</p>"
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
                    name="language"
                    label="Preferred Language"
                    description="Please note that most communications will be sent in English."
                    placeholder="Select a preferred language"
                    options={preferredLanguageOptions}
                  />
                  <Checkbox
                    name="interest"
                    label="I'm interested in"
                    options={interestsOptions}
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
