import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Checkbox from 'components/forms/components/checkbox';
import Submit from 'components/forms/components/submit';

import { email as validateEmail } from 'components/forms/validations';

import './styles.scss';

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
    saveNewsletterSubscription: PropTypes.func.isRequired,
    countries: PropTypes.array,
    initialValues: PropTypes.object
  };

  render() {
    const { saveNewsletterSubscription, countries, initialValues } = this.props;

    return (
      <Fragment>
        <Form
          className="c-subscribe-form"
          onSubmit={saveNewsletterSubscription}
          initialValues={initialValues}
          render={({ handleSubmit, valid, submitting, submitFailed }) => (
            <form className="c-subscribe-form" onSubmit={handleSubmit}>
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
              <Input name="organization" label="organization" />
              <Input name="city" label="city" required />
              <Select
                name="country"
                label="country"
                options={countries}
                placeholder="Select a country"
                required
              />
              <Checkbox
                name="subscriptions"
                label="I'm interests in (check all that apply)"
                options={subscriptions}
              />
              <Submit
                valid={valid}
                submitting={submitting}
                submitFailed={submitFailed}
              >
                subscribe
              </Submit>
            </form>
          )}
        />
        <CountryDataProvider />
      </Fragment>
    );
  }
}

export default NewsletterForm;
