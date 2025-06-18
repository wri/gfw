import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { submitContactForm } from 'services/forms';

import Link from 'next/link';
import Button from 'components/ui/button';

import Checkbox from 'components/forms/components/checkbox';
import Error from 'components/forms/components/error';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Submit from 'components/forms/components/submit';

import { email as emailValidator } from 'components/forms/validations';

import axios from 'axios';
import { ORTTO_REQUESTS_TYPES } from 'pages/api/ortto/constants';
import { topics, tools } from './config';

const isServer = typeof window === 'undefined';

class ContactForm extends PureComponent {
  static propTypes = {
    resetForm: PropTypes.func,
    initialValues: PropTypes.object,
  };

  sendContactForm = async (values) => {
    const language =
      !isServer && window.Transifex
        ? window.Transifex.live.getSelectedLanguageCode()
        : 'en';
    const {
      firstName,
      lastName,
      email,
      message,
      receive_updates,
      tool,
      topic,
    } = values;

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      message,
      tool,
      topic,
      signup: receive_updates,
    };

    try {
      await submitContactForm({ ...data, language });

      if (receive_updates) {
        const orttoData = {
          ...data,
          receive_updates,
          source: ORTTO_REQUESTS_TYPES.CONTACT_US_FORM,
        };

        await axios.post('/api/ortto', orttoData);
      }

      return true;
    } catch (error) {
      const { errors } = error.response && error.response.data;
      return {
        [FORM_ERROR]:
          (errors && error.length && errors[0].detail) || 'Service unavailable',
      };
    }
  };

  render() {
    const { resetForm, initialValues } = this.props;
    return (
      <Form onSubmit={this.sendContactForm} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          valid,
          submitFailed,
          submitSucceeded,
          submitError,
          values,
          form: { reset },
        }) => {
          const activeTopic = topics.find((t) => t.value === values.topic);
          return (
            <div className="c-contact-form">
              {submitSucceeded ? (
                <div className="feedback-message">
                  <h3>
                    Thank you for contacting Global Forest Watch! Check your
                    inbox for a confirmation email.
                  </h3>
                  <p>Interested in getting news and updates from us?</p>
                  <div className="button-group">
                    <Link href="/subscribe">
                      <a>
                        <Button>Subscribe</Button>
                      </a>
                    </Link>
                    <Button
                      className="close-button"
                      onClick={resetForm || (() => reset())}
                    >
                      No thanks
                    </Button>
                  </div>
                </div>
              ) : (
                <Fragment>
                  <p className="subtitle">
                    For media inquiries, email{' '}
                    <a href="mailto:Kaitlyn.Thayer@wri.org">
                      Kaitlyn.Thayer@wri.org
                    </a>
                  </p>
                  <form onSubmit={handleSubmit}>
                    <Input
                      name="email"
                      type="email"
                      label="email"
                      placeholder="example@globalforestwatch.org"
                      validate={[emailValidator]}
                      required
                    />
                    <Input
                      name="firstName"
                      type="text"
                      label="first name"
                      required
                    />
                    <Input
                      name="lastName"
                      type="text"
                      label="last name"
                      required
                    />
                    <Select
                      name="topic"
                      label="topic"
                      placeholder="Select a topic"
                      options={topics}
                      required
                    />
                    <Select
                      name="tool"
                      label="tool"
                      placeholder="Select a tool that applies"
                      options={tools}
                      required
                    />
                    <Input
                      name="message"
                      label="message"
                      type="textarea"
                      placeholder={activeTopic && activeTopic.placeholder}
                      required
                    />
                    <Checkbox
                      name="receive_updates"
                      label="I WOULD LIKE TO RECEIVE UPDATES ON NEWS AND EVENTS FROM GLOBAL FOREST WATCH"
                      options={[{ label: 'Yes', value: 'true' }]}
                    />
                    <Error
                      valid={valid}
                      submitFailed={submitFailed}
                      submitError={submitError}
                    />
                    <Submit submitting={submitting}>send</Submit>
                  </form>
                </Fragment>
              )}
            </div>
          );
        }}
      </Form>
    );
  }
}

export default ContactForm;
