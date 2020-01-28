import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { postNewsletterSubscription } from 'services/newsletter';

import CountryDataProvider from 'providers/country-data-provider';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Checkbox from 'components/forms/components/checkbox';
import Submit from 'components/forms/components/submit';
import Thankyou from 'components/thankyou';

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
    countries: PropTypes.array,
    initialValues: PropTypes.object
  };

  saveNewsletterSubscription = values => {
    const {
      firstName,
      lastName,
      email,
      organization,
      city,
      country,
      comments,
      gfwInterests
    } = values;

    const postData = {
      first_name: firstName,
      last_name: lastName,
      email,
      company: organization,
      city,
      country,
      gfw_interests: gfwInterests
        ? Object.entries(gfwInterests)
          .filter(([, val]) => val)
          .map(([key]) => key)
          .join(', ')
        : '',
      pardot_extra_field: comments
    };

    return postNewsletterSubscription(postData)
      .then(() => {})
      .catch(error => {
        if (!error.response) {
          return true;
        }

        return {
          [FORM_ERROR]: 'Service unavailable'
        };
      });
  };

  render() {
    const { countries, initialValues } = this.props;

    return (
      <Fragment>
        <Form
          className="c-subscribe-form"
          onSubmit={this.saveNewsletterSubscription}
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded
          }) => (
            <form className="c-subscribe-form" onSubmit={handleSubmit}>
              <div className="row">
                {submitSucceeded ? (
                  <div className="column small-12">
                    <Thankyou
                      title="Thank you for subscribing to Global Forest Watch newsletters and updates!"
                      description="You may wish to read our <a href='/privacy-policy' target='_blank'>privacy policy</a>, which provides further information about how we use personal data."
                    />
                  </div>
                ) : (
                  <Fragment>
                    <div className="column small-12">
                      <h1>{"Stay Updated on the World's Forests"}</h1>
                      <h3>
                        Subscribe to monthly GFW newsletters and updates based
                        on your interests.
                      </h3>
                    </div>
                    <div className="column small-12 medium-6">
                      <Checkbox
                        name="gfwInterests"
                        label="I'm interests in (check all that apply)"
                        options={subscriptions}
                      />
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
                      <Input name="organization" label="organization" />
                      <Input name="city" label="city" required />
                      <Select
                        name="country"
                        label="country"
                        options={countries}
                        placeholder="Select a country"
                        required
                      />

                      <Submit
                        valid={valid}
                        submitting={submitting}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      >
                        subscribe
                      </Submit>
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

export default NewsletterForm;
