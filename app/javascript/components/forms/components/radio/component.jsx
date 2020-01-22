/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { composeValidators } from 'components/forms/validations';

import FieldWrapper from 'components/forms/components/field-wrapper';

import './styles.scss';

class Radio extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    required: PropTypes.bool
  };

  render() {
    const { name, label, validate, options, hidden, required } = this.props;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="select"
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <div className="c-form-radio">
              {options &&
                options.map(option => (
                  <div key={option.value} className="radio-option">
                    <Field
                      id={`radio-${option.value}`}
                      name={input.name}
                      component="input"
                      type="radio"
                      value={option.value}
                    />
                    <label
                      className="radio-label"
                      htmlFor={`radio-${option.value}`}
                    >
                      <span />
                      {option.label}
                    </label>
                  </div>
                ))}
            </div>
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Radio;
