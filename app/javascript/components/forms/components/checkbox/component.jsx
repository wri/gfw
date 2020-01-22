/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { composeValidators } from 'components/forms/validations';

import FieldWrapper from 'components/forms/components/field-wrapper';

import './styles.scss';

class Checkbox extends PureComponent {
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
        component="input"
        type="checkbox"
      >
        {({ meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <div className="c-form-checkbox">
              {options &&
                options.map(option => (
                  <div key={option.value} className="checkbox-option">
                    <Field
                      name={name}
                      id={`checkbox-${option.value}`}
                      component="input"
                      type="checkbox"
                      value={option.value}
                    />
                    <label
                      className="checkbox-label"
                      htmlFor={`checkbox-${option.value}`}
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

export default Checkbox;
