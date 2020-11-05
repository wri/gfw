import cx from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

export const BasemapButton = ({ value, image, label, active, onClick }) => (
  <div className="basemaps-header">
    {isDesktop && (
      <div className="basemaps-actions">
        <Button
          className="info-btn"
          theme="theme-button-tiny theme-button-grey-filled square"
          onClick={() => setModalMetaSettings('flagship_basemaps')}
        >
          <Icon icon={infoIcon} />
        </Button>
        <button className="basemaps-action-button" onClick={onClose}>
          <Icon icon={closeIcon} />
        </button>
      </div>
    )}
  </div>
)

BasemapButton.propTypes = {
  value: PropTypes.string,
  image: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}

export default BasemapButton;