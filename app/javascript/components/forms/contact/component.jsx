import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import { Field, reduxForm } from 'redux-form';

import {
  renderInput,
  renderTextarea,
  renderSelect,
  renderRadio
} from 'components/forms/fields';

import { email, required } from 'components/forms/validations';

import { topics, tools, testNewFeatures } from './config';

import './styles.scss';

const placeHolderValidator = value =>
  (value && value === 'placeholder' ? 'Select a topic' : undefined);
const toolValidator = value =>
  (value && value === 'placeholder' ? 'Select a tool' : undefined);

class ContactForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    data: PropTypes.object,
    submitting: PropTypes.bool
  };

  render() {
    const { data, handleSubmit, submitting } = this.props;
    const activeTopic =
      data &&
      data.values &&
      data.values.topic &&
      topics.find(t => t.value === data.values.topic);

    return (
      <form className="c-contact-form" onSubmit={handleSubmit}>
        <Field
          name="email"
          type="email"
          label="email *"
          placeholder="example@globalforestwatch.org"
          validate={[required, email]}
          component={renderInput}
        />
        <Field
          name="topic"
          type="select"
          label="topic *"
          options={topics}
          component={renderSelect}
          validate={[required, placeHolderValidator]}
          placeholder="Select a topic"
        />
        <Field
          name="tool"
          label="tool *"
          options={tools}
          component={renderSelect}
          validate={[required, toolValidator]}
          placeholder="Select a tool that applies"
        />
        <Field
          name="message"
          label="message *"
          type="textarea"
          validate={[required]}
          placeholder={activeTopic && activeTopic.placeholder}
          component={renderTextarea}
        />
        <h4>Interested in testing new features?</h4>
        <p>Sign up to become an official GFW tester!</p>
        <Field
          name="signup"
          type="radio"
          options={testNewFeatures}
          component={renderRadio}
        />
        <Button className="submit-btn" type="submit" disabled={submitting}>
          Submit
        </Button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'contact',
  initialValues: {
    signup: 'no'
  }
})(ContactForm);
