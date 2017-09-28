import React from 'react';
import { Field, reduxForm } from 'redux-form';

const validate = values => {
  const errors = {};
  if (!values.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = true;
  }
  if (!values.topic) {
    errors.topic = true;
  }
  if (!values.message) {
    errors.message = true;
  }

  return errors
};

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  return (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type} />
        {touched &&
        error &&
        <span>{error}</span>}
      </div>
    </div>
  );
}


const ContactUsForm = props => {
  const { handleSubmit, submitting } = props;

  const topics = [
    {
      key: 'report-a-bug-or-error-on-gfw',
      name: 'Report a bug or error on GFW',
      placeholder: 'Explain the bug or error and tell us where on the website you encountered it. What browser (e.g., Chrome version 50.0.2661.94 m) and operating system (e.g., Windows 8.1) do you use?',
    },
    {
      key: 'provide-feedback',
      name: 'Provide feedback',
      placeholder: 'Tell us about your experience with GFW! Examples: How can we improve GFW? Why did you visit GFW? How do you use GFW? If and how is the information provided by GFW useful for your work? Are there any additional features and/or data that would be useful?  Was anything confusing or difficult to use?  Etc...',
    },
    {
      key: 'media-request',
      name: 'Media request',
      placeholder: 'How can we help you?',
    },
    {
      key: 'data-related-inquiry',
      name: 'Data-related inquiry or suggestion',
      placeholder: 'How can we help you?',
    },
    {
      key: 'gfw-commodities-inquiry',
      name: 'GFW Commodities inquiry',
      placeholder: 'How can we help you?',
    },
    {
      key: 'gfw-fires-inquiry',
      name: 'GFW Fires inquiry',
      placeholder: 'How can we help you?',
    },
    {
      key: 'gfw-climate-inquiry',
      name: 'GFW Climate inquiry',
      placeholder: 'How can we help you?',
    },
    {
      key: 'gfw-water-inquiry',
      name: 'GFW Water inquiry',
      placeholder: 'How can we help you?',
    },
    {
      key: 'general-inquiry',
      name: 'General inquiry',
      placeholder: 'How can we help you?',
    }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>EMAIL *</label>
        <div>
          <Field
            name="email"
            component={renderField}
            type="email"
          />
        </div>
      </div>
      <div>
        <label>TOPIC *</label>
        <div>
          <Field name="topic" component="select">
            <option />
            {topics.map((topic,i) => {
              return <option key={i} value={topic.key}>{topic.name}</option>;
            })}
          </Field>
        </div>
      </div>
      <div>
        <label>MESSAGE *</label>
        <div>
          <Field
            name="message"
            component="textarea"
            placeholder="How can we help you?"/>
        </div>
      </div>
      <div>
        <label>Interested in testing new features on GFW?</label>
        <div>Sign up and become and official GFW tester!</div>
        <div>
          <label>
            <Field
              name="signup-true"
              component="input"
              type="radio"
              value="true"
            />
            Yes, sign me up.
          </label>
          <label>
            <Field
              name="signup-false"
              component="input"
              type="radio"
              value="true"
            />
            No thanks.
          </label>
        </div>
      </div>
      <div>
        <button type="submit" disabled={submitting}>SUBMIT</button>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'contactUs',
  validate
})(ContactUsForm)