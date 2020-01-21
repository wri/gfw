import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import {
  renderInput,
  renderSelect,
  renderCheckList,
  renderSubmit
} from 'components/forms/fields';
import CountryDataProvider from 'providers/country-data-provider';

import { email as validateEmail, required } from 'components/forms/validations';

import './styles.scss';

const countryValidator = value =>
  (value && value === 'placeholder' ? 'Select a country' : undefined);

const subscriptions = [
  { label: 'Innovations in Monitoring', value: 'monitoring' },
  { label: 'Fires', value: 'fires' },
  { label: 'Forest Watcher Mobile App', value: 'fwapp' },
  { label: 'Climate and Biodiversity', value: 'climate' },
  { label: 'Agricultural Supply Chains', value: 'supplychains' },
  { label: 'Small Grants Fund and Tech Fellowship', value: 'sgf' }
];

class NewsletterForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    countries: PropTypes.array,
    valid: PropTypes.bool,
    submitFailed: PropTypes.bool
  };

  render() {
    const {
      countries,
      handleSubmit,
      submitting,
      submitFailed,
      valid
    } = this.props;

    return (
      <form className="c-subscribe-form" onSubmit={handleSubmit}>
        <CountryDataProvider />
        <Field
          name="firstName"
          type="text"
          label="first name *"
          validate={[required]}
          component={renderInput}
        />
        <Field
          name="lastName"
          type="text"
          label="last name *"
          validate={[required]}
          component={renderInput}
        />
        <Field
          name="email"
          type="email"
          label="email *"
          placeholder="example@globalforestwatch.org"
          validate={[required, validateEmail]}
          component={renderInput}
        />
        <Field
          name="organization"
          type="text"
          label="organization"
          component={renderInput}
        />
        <Field
          name="city"
          type="text"
          label="city *"
          validate={[required]}
          component={renderInput}
        />
        <Field
          name="country"
          type="select"
          label="country *"
          options={countries}
          component={renderSelect}
          validate={[required, countryValidator]}
          placeholder="Select a country"
        />
        <Field
          name="subscriptions"
          type="checkbox"
          label="I'm interests in (check all that apply) *"
          options={subscriptions}
          component={renderCheckList}
        />
        <Field
          name="comments"
          type="text"
          label="Comments *"
          component={renderInput}
          hidden
        />
        {renderSubmit({
          submitting,
          submitFailed,
          valid,
          children: 'subscribe'
        })}
      </form>
    );
  }
}

export default reduxForm({
  form: 'newsletter'
})(NewsletterForm);
