import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import Input from 'components/forms/components/input';
import Select from 'components/forms/components/select';
import Radio from 'components/forms/components/radio';
import Submit from 'components/forms/components/submit';

import { email } from 'components/forms/validations';

import { topics, tools, testNewFeatures } from './config';

import './styles.scss';

class ContactForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  render() {
    const { onSubmit } = this.props;

    return (
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, valid, submitFailed, values }) => {
          const activeTopic = topics.find(t => t.value === values.topic);

          return (
            <div className="c-contact-form">
              <p className="subtitle">
                For media inquiries, email{' '}
                <a href="mailto:katie.lyons@wri.org">katie.lyons@wri.org</a>
              </p>
              <form className="c-contact-form" onSubmit={handleSubmit}>
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
                <h4>Interested in testing new features?</h4>
                <p>Sign up to become an official GFW tester!</p>
                <Radio name="signup" options={testNewFeatures} />
                <Submit
                  valid={valid}
                  submitting={submitting}
                  submitFailed={submitFailed}
                >
                  send
                </Submit>
              </form>
            </div>
          );
        }}
      </Form>
    );
  }
}

export default ContactForm;
