import cx from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

export const BasemapButton = (props) => {
  const { image, label, active, onClick } = props;

  return (
    <button
      className="c-basemap-button"
      onClick={() => onClick(props)}
    >
      <img src={image} alt={label} className={cx('basemap-thumb', { '-active': active })} />
      <span>{label}</span>
    </button>
  )
}

BasemapButton.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}

export default BasemapButton;