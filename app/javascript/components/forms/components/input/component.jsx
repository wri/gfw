/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { composeValidators } from 'components/forms/validations';

import FieldWrapper from 'components/forms/components/field-wrapper';

import './styles.scss';

class Input extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool,
    collapse: PropTypes.bool,
    infoClick: PropTypes.func
  };

  render() {
    const {
      name,
      label,
      validate,
      type,
      placeholder,
      hidden,
      required,
      infoClick,
      collapse
    } = this.props;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        type={type}
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
            infoClick={infoClick}
            collapse={collapse}
          >
            {type === 'textarea' ? (
              <textarea
                className="c-form-input textarea"
                {...input}
                type={type}
                placeholder={placeholder}
              />
            ) : (
              <input
                className="c-form-input"
                {...input}
                type={type}
                placeholder={placeholder}
              />
            )}
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Input;
