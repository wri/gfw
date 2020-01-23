import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { empty } from 'components/forms/validations';

import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Input from 'components/forms/components/input';

import './styles.scss';

class Submit extends PureComponent {
  static propTypes = {
    valid: PropTypes.bool,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
    submitError: PropTypes.string,
    success: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {
      valid,
      submitting,
      children,
      submitFailed,
      submitError,
      success
    } = this.props;

    return (
      <Fragment>
        <Input
          name="pardot_extra_field"
          label="comments"
          validate={[empty]}
          hidden
        />
        <div className="c-form-submit">
          {!submitError &&
            !valid &&
            submitFailed && <span>Required fields are empty!</span>}
          {submitError && <span>{submitError}</span>}
          {!submitError &&
            success && <span className="success">{success}</span>}
          <Button className="submit-btn" type="submit" disabled={submitting}>
            {submitting ? <Loader className="submit-loader" /> : children}
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Submit;
