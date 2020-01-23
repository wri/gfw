import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Loader from 'components/ui/loader';

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
      <div className="c-form-submit">
        {!submitError &&
          !valid &&
          submitFailed && <span>Required fields are empty!</span>}
        {submitError && <span>{submitError}</span>}
        {success && <span className="success">{success}</span>}
        <Button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <Loader className="submit-loader" /> : children}
        </Button>
      </div>
    );
  }
}

export default Submit;
