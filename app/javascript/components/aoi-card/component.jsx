import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon/icon-component';

import tagIcon from 'assets/icons/tag.svg';
import subscribedIcon from 'assets/icons/subscribed.svg';

import './styles.scss';

class AoICard extends PureComponent {
  static propTypes = {
    index: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    tags: PropTypes.array,
    image: PropTypes.string
  };

  render() {
    const { index, id, image, tags, name } = this.props;

    return (
      <div key={id} className="c-aoi-card">
        <img src={image} alt={name} />
        <div className="aoi-item-body">
          <p className="aoi-title">{name}</p>
          {tags &&
            tags.length > 0 && (
            <div className="aoi-tags">
              <Icon icon={tagIcon} className="tag-icon" />
              <p>{tags.join(', ')}</p>
            </div>
          )}
          {(index + 1) % 3 === 0 && ( // TODO: get subscribed status from API
            <div className="aoi-subscribed">
              <Icon icon={subscribedIcon} className="subscribed-icon" />
              <p>Subscribed</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AoICard;
