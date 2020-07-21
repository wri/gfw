import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { empty } from 'components/forms/validations';

import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Input from 'components/forms/components/input';

import './styles.scss';

class Submit extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    submitting: PropTypes.bool,
    children: PropTypes.node
  };

  render() {
    const { submitting, children, className } = this.props;

    return (
      <div className={cx('c-form-submit', className)}>
        <Input
          name="pardot_extra_field"
          label="comments"
          validate={[empty]}
          hidden
        />
        <Button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <Loader className="submit-loader" /> : children}
        </Button>
      </div>
    );
  }
}

export default Submit;
