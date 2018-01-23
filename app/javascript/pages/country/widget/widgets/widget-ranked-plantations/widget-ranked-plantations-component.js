import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import './widget-ranked-plantations-styles.scss';

class WidgetRankedPlantations extends PureComponent {
  render() {
    const { data, sentence } = this.props;
    console.log(data);
    return (
      <div className="c-widget-ranked-plantations">
        {data && (
          <div className="data-container">
            {sentence && <WidgetDynamicSentence sentence={sentence} />}

            <BarChart width={730} height={250} data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Recently cleared"
                fill="#8884d8"
                stackId="1"
                layout="vertical"
              />
              <Bar
                dataKey="Fruit Tree mix"
                fill="#82ca9d"
                stackId="1"
                layout="vertical"
              />
              <Bar
                dataKey="Unknown"
                fill="#000000"
                stackId="1"
                layout="vertical"
              />
              <Bar
                dataKey="Wood fiber / timber"
                fill="blue"
                stackId="1"
                layout="vertical"
              />
            </BarChart>
          </div>
        )}
      </div>
    );
  }
}

WidgetRankedPlantations.propTypes = {
  data: PropTypes.array,
  sentence: PropTypes.string
};

export default WidgetRankedPlantations;
