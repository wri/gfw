import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import AoICard from 'components/aoi-card';

import mapIcon from 'assets/icons/view-map.svg';
import editIcon from 'assets/icons/edit.svg';
import shareIcon from 'assets/icons/share.svg';

import './styles.scss';

class AreasTable extends PureComponent {
  static propTypes = {
    areas: PropTypes.array,
    onClickViewMap: PropTypes.func
  };

  render() {
    const { areas, onClickViewMap } = this.props;

    return (
      <div className="c-areas-table">
        {areas &&
          !!areas.length &&
          areas.map((area, i) => (
            <div key={area.id} className="row area-row">
              <div className="column small-12 medium-9">
                <AoICard index={i} {...area} />
              </div>
              <div className="column small-12 medium-3">
                <div className="area-links">
                  <Button
                    className="area-link"
                    theme="theme-button-clear"
                    onClick={() => onClickViewMap(area)}
                  >
                    <Icon className="link-icon" icon={mapIcon} />
                    view on map
                  </Button>
                  <Button
                    className="area-link"
                    theme="theme-button-clear"
                    onClick={() => onClickViewMap(area)}
                  >
                    <Icon className="link-icon" icon={editIcon} />
                    edit
                  </Button>
                  <Button className="area-link" theme="theme-button-clear">
                    <Icon className="link-icon" icon={shareIcon} />
                    share
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default AreasTable;
