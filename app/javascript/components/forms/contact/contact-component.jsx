import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import { Field, reduxForm } from 'redux-form';

import {
  renderRadio,
  renderTextarea,
  renderSelect,
  renderInput
} from 'components/forms/form-fields';
import 'components/forms/form-styles.scss';

const validate = values => {
  const errors = {};
  if (
    !values.email ||
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = true;
  }
  if (!values.topic) {
    errors.topic = true;
  }
  if (!values.message) {
    errors.message = true;
  }

  return errors;
};

const topics = [
  {
    key: 'report-a-bug-or-error-on-gfw',
    name: 'Report a bug or error on GFW',
    placeholder:
      'Explain the bug or error and tell us where on the website you encountered it. What browser (e.g., Chrome version 50.0.2661.94 m) and operating system (e.g., Windows 8.1) do you use?'
  },
  {
    key: 'provide-feedback',
    name: 'Provide feedback',
    placeholder:
      'Tell us about your experience with GFW! Examples: How can we improve GFW? Why did you visit GFW? How do you use GFW? If and how is the information provided by GFW useful for your work? Are there any additional features and/or data that would be useful?  Was anything confusing or difficult to use?  Etc...'
  },
  {
    key: 'media-request',
    name: 'Media request',
    placeholder: 'How can we help you?'
  },
  {
    key: 'data-related-inquiry',
    name: 'Data-related inquiry or suggestion',
    placeholder: 'How can we help you?'
  },
  {
    key: 'general-inquiry',
    name: 'General inquiry',
    placeholder: 'How can we help you?'
  }
];

class Contact extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, handleSubmit, submitting } = this.props;
    const activeTopic =
      data && topics.find(t => t.key === data.values && data.values.topic);
    return (
      <form className="c-form" onSubmit={handleSubmit}>
        <Field
          name="email"
          type="email"
          label="EMAIL *"
          placeholder=""
          component={renderInput}
        />
        <Field
          name="topic"
          label="TOPIC *"
          options={topics}
          component={renderSelect}
        />
        <Field
          name="message"
          label="MESSAGE *"
          placeholder={activeTopic && activeTopic.placeholder}
          component={renderTextarea}
        />
        <h4>Interested in testing new features on GFW?</h4>
        <div className="radio">
          <p>Sign up and become and official GFW tester</p>
          <Field
            id="signup-true"
            name="signup"
            type="radio"
            value="true"
            label="Yes, sign me up."
            component={renderRadio}
          />
          <Field
            id="signup-false"
            name="signup"
            type="radio"
            value="false"
            label="No thanks."
            component={renderRadio}
          />
        </div>
        <Button className="submit-btn" type="submit" disabled={submitting}>
          Submit
        </Button>
      </form>
    );
  }
}

Contact.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'contact',
  validate,
  initialValues: {
    topic: 'provide-feedback',
    signup: 'false'
  }
})(Contact);
