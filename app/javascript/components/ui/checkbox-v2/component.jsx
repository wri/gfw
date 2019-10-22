import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';

import './styles.scss';

const Checkbox = ({
  className,
  checked,
  onChange,
  label,
  subLabel,
  infoAction
}) => (
  <div className={cx('c-checkbox-v2', className)}>
    {/* eslint-disable-next-line jsx-a11y/label-has-for */}
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="label">
        {label && <p>{label}</p>}
        {subLabel && (
          <div className="sub-label">
            <span>{subLabel}</span>
            {infoAction && (
              <Button
                className="info-btn"
                theme="theme-button-tiny theme-button-grey-filled square"
                onClick={infoAction}
              >
                <Icon icon={infoIcon} />
              </Button>
            )}
          </div>
        )}
      </div>
    </label>
  </div>
);

export default Checkbox;

Checkbox.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  infoAction: PropTypes.func
};

Checkbox.defaultProps = {
  checked: false,
  onChange: null
};
