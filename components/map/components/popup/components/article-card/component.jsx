import React from 'react';
import PropTypes from 'prop-types';

import Card from 'components/ui/card';

import './styles.scss';

const ArticleCard = ({ data, setMapSettings }) => (
  <Card
    className="c-article-card"
    theme="theme-card-small"
    clamp={5}
    data={{
      ...data,
      buttons: data?.buttons?.map((b) =>
        b.text === 'ZOOM'
          ? {
              ...b,
              onClick: () =>
                setMapSettings({
                  canBound: true,
                  bbox: data.bbox,
                }),
            }
          : b
      ),
    }}
  />
);

ArticleCard.propTypes = {
  data: PropTypes.shape({
    buttons: PropTypes.array,
    bbox: PropTypes.array,
  }),
  setMapSettings: PropTypes.func,
};

export default ArticleCard;
