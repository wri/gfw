import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import infoIcon from 'assets/icons/info.svg';
import { Tooltip } from 'react-tippy';

// @1x biodiversity
import bio1 from 'pages/topics/assets/biodiversity/biodiversity1.png';
import bio2 from 'pages/topics/assets/biodiversity/biodiversity2.png';
import bio3 from 'pages/topics/assets/biodiversity/biodiversity3.png';
import bio4 from 'pages/topics/assets/biodiversity/biodiversity4.png';

// @2x biodiversity
import bio1_2x from 'pages/topics/assets/biodiversity/biodiversity1@2x.png';
import bio2_2x from 'pages/topics/assets/biodiversity/biodiversity2@2x.png';
import bio3_2x from 'pages/topics/assets/biodiversity/biodiversity3@2x.png';
import bio4_2x from 'pages/topics/assets/biodiversity/biodiversity4@2x.png';

// @1x commodities
import com1 from 'pages/topics/assets/commodities/commodities1.png';
import com2 from 'pages/topics/assets/commodities/commodities2.png';
import com3 from 'pages/topics/assets/commodities/commodities3.png';
import com4 from 'pages/topics/assets/commodities/commodities4.png';

// @2x commodities
import com1_2x from 'pages/topics/assets/commodities/commodities1@2x.png';
import com2_2x from 'pages/topics/assets/commodities/commodities2@2x.png';
import com3_2x from 'pages/topics/assets/commodities/commodities3@2x.png';
import com4_2x from 'pages/topics/assets/commodities/commodities4@2x.png';

// @1x climate
import clim1 from 'pages/topics/assets/climate/climate1.png';
import clim2 from 'pages/topics/assets/climate/climate2.png';
import clim3 from 'pages/topics/assets/climate/climate3.png';
import clim4 from 'pages/topics/assets/climate/climate4.png';

// @2x climate
import clim1_2x from 'pages/topics/assets/climate/climate1@2x.png';
import clim2_2x from 'pages/topics/assets/climate/climate2@2x.png';
import clim3_2x from 'pages/topics/assets/climate/climate3@2x.png';
import clim4_2x from 'pages/topics/assets/climate/climate4@2x.png';

// @1x water
import water1 from 'pages/topics/assets/water/water1.png';
import water2 from 'pages/topics/assets/water/water2.png';
import water3 from 'pages/topics/assets/water/water3.png';
import water4 from 'pages/topics/assets/water/water4.png';

// @2x water
import water1_2x from 'pages/topics/assets/water/water1@2x.png';
import water2_2x from 'pages/topics/assets/water/water2@2x.png';
import water3_2x from 'pages/topics/assets/water/water3@2x.png';
import water4_2x from 'pages/topics/assets/water/water4@2x.png';

import './styles.scss';

class TopicsImage extends PureComponent {
  render() {
    const imgs = {
      '1x': {
        biodiversity1: bio1,
        biodiversity2: bio2,
        biodiversity3: bio3,
        biodiversity4: bio4,
        commodities1: com1,
        commodities2: com2,
        commodities3: com3,
        commodities4: com4,
        climate1: clim1,
        climate2: clim2,
        climate3: clim3,
        climate4: clim4,
        water1,
        water2,
        water3,
        water4
      },
      '2x': {
        biodiversity1: bio1_2x,
        biodiversity2: bio2_2x,
        biodiversity3: bio3_2x,
        biodiversity4: bio4_2x,
        commodities1: com1_2x,
        commodities2: com2_2x,
        commodities3: com3_2x,
        commodities4: com4_2x,
        climate1: clim1_2x,
        climate2: clim2_2x,
        climate3: clim3_2x,
        climate4: clim4_2x,
        water1: water1_2x,
        water2: water2_2x,
        water3: water3_2x,
        water4: water4_2x
      }
    };
    const { url, description, prompts } = this.props;

    return (
      <div className="c-topics-image">
        <img
          srcSet={`${imgs['2x'][url]} 2x,
            ${imgs['1x'][url]} 1x,`}
          src={`${imgs['1x'][url]} 1x`}
          alt={description}
        />
        {prompts &&
          prompts.map(p => (
            <Fragment key={p.id}>
              <Tooltip
                className="image-info"
                style={{
                  left: `${p.position[0]}%`,
                  top: `${p.position[1]}%`
                }}
                theme="light"
                interactive
                arrow
                sticky
                html={
                  <div className="c-topics-info-tooltip">
                    <p>{p.content}</p>
                    {p.link && (
                      <Button theme="theme-button-small" extLink={p.link}>
                        {p.btnText}
                      </Button>
                    )}
                  </div>
                }
              >
                <Button className="info-btn" theme="theme-button-small square">
                  <Icon icon={infoIcon} />
                </Button>
              </Tooltip>
            </Fragment>
          ))}
      </div>
    );
  }
}

TopicsImage.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string,
  prompts: PropTypes.array
};

export default TopicsImage;
