import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { submitContactForm } from 'services/forms';

import Button from 'components/ui/button';

import Error from 'components/forms/components/error';
import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Submit from 'components/forms/components/submit';

import { email } from 'components/forms/validations';

import { topics, tools } from './config';

import './styles.scss';

class ContactForm extends PureComponent {
  static propTypes = {
    // sendContactForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
    initialValues: PropTypes.object,
  };

  sendContactForm = (values) => {
    const language = window.Transifex
      ? window.Transifex.live.getSelectedLanguageCode()
      : 'en';

    return submitContactForm({ ...values, language })
      .then(() => {})
      .catch((error) => {
        const { errors } = error.response && error.response.data;

        return {
          [FORM_ERROR]:
            (errors && error.length && errors[0].detail) ||
            'Service unavailable',
        };
      });
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
                    {/* <Link to="/subscribe">
                      <Button>Subscribe</Button>
                    </Link> */}
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
                    For media inquiries, email
                    {' '}
                    <a href="mailto:katie.lyons@wri.org">katie.lyons@wri.org</a>
                  </p>
                  <form onSubmit={handleSubmit}>
                    <Input
                      name="email"
                      type="email"
                      label="email"
                      placeholder="example@globalforestwatch.org"
                      validate={[email]}
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
