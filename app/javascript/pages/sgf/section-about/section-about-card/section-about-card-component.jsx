import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import Icon from 'components/icon/icon';

import infoIcon from 'assets/icons/info.svg';
import './section-about-card-styles.scss';

class SectionAboutCard extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className } = this.props;
    const { title, link, items } = this.props.data;
    const cardTitle = <h3 className="card-title">{title}</h3>;
    return (
      <div className={`c-section-about-card ${className}`}>
        {link ? <a href={link}>{cardTitle}</a> : cardTitle}
        {items &&
          !!items.length && (
            <ul className="card-description">
              {items.map(i => {
                const tooltip = i.tooltip ? (
                  <Tooltip
                    title={i.tooltip}
                    position="top"
                    trigger="click"
                    animation="scale"
                    arrow
                    size="small"
                    className="tooltip"
                  >
                    <Icon icon={infoIcon} className="info-icon" />
                  </Tooltip>
                ) : null;
                const item = i.link ? <a href={i.link}>{i.label}</a> : i.label;
                return (
                  <li key={i.label}>
                    {item} {tooltip}
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    );
  }
}

SectionAboutCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    items: PropTypes.array
  }).isRequired,
  className: PropTypes.string.isRequired
};

SectionAboutCard.defaultProps = {
  className: ''
};

export default SectionAboutCard;
