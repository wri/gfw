import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { format } from 'd3-format';

import { Sankey } from 'cw-components';

import './styles';

class WidgetTreeCover extends PureComponent {
  render() {
    // const { data, settings, simple } = this.props;

    const testData = {
      nodes: [
        {
          name: 'Germany',
          color: '#00955f'
        },
        {
          name: `France, in Western Europe, encompasses medieval cities, alpine villages and Mediterranean beaches. Paris, its capital, is
            famed for its fashion houses, classical art museums including the Louvre and monuments like the Eiffel Tower`,
          color: '#FFB400'
        },
        {
          name: `Switzerland is a mountainous Central European country, home to numerous lakes, villages and the high peaks of the Alps. Its
            cities contain medieval quarters, with landmarks like capital Bern’s Zytglogge`,
          color: '#3498db'
        },
        {
          name: 'Portugal',
          color: '#ab0000'
        },
        {
          name: `Grants 2 are made to fund a specific project and require some level of compliance and reporting. The grant writing process
            involves an applicant submitting a proposal (or submission) to a potential funder, either on the applicants own initiative or
            in response to a Request for Proposal from the funder.`,
          color: '#00955f'
        },
        {
          name: `Loans is the lending of money by one or more individuals, organizations, and/or other entities to other individuals,
            organizations etc.`,
          color: '#FFB400'
        },
        {
          name: 'Loans 2',
          color: '#3498db'
        },
        {
          name: 'Grants',
          color: '#FF7800'
        },
        {
          name: `Grants are made to fund a specific project and require some level of compliance and reporting. The grant writing process
            involves an applicant submitting a proposal (or submission) to a potential funder`,
          color: '#FF7800'
        },
        {
          name: `Grants are non-repayable funds or products disbursed or given by one party (grant makers), often a government department,
            corporation, foundation or trust`,
          color: '#FF73D0'
        },
        {
          name: 'Empty',
          color: '#FF7800'
        }
      ],
      links: [
        { source: 0, target: 6, value: 1000, timeframes: '2010-2014' },
        { source: 0, target: 4, value: 940000, timeframes: '2012-2014' },
        { source: 1, target: 4, value: 150000 },
        { source: 2, target: 4, value: 5700000 },
        { source: 1, target: 5, value: 1190000, timeframes: '2011-2014' },
        { source: 0, target: 6, value: 5700000, timeframes: '2013-2014' },
        { source: 1, target: 7, value: 11190000, timeframes: '2010-2014' },
        { source: 0, target: 8, value: 5700000, timeframes: '2011-2014' },
        { source: 1, target: 9, value: 10, timeframes: '2010-2014' },
        { source: 3, target: 9, value: 9092312, timeframes: '2010-2014' }
      ]
    };

    const config = {
      tooltip: {
        scale: 1 / 100000,
        suffix: 'm',
        unit: 'USD million'
      },
      node: {
        scale: 1 / 100000,
        suffix: 'm'
      }
    };

    return (
      <div className="c-pie-chart-legend-widget">
        <Sankey
          data={testData}
          config={config}
          tooltipChildren={() => (
            // tooltipChildren={node => (
            <div>Tooltip Extra Info: extra info here</div>
          )}
        />;
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  // data: PropTypes.array,
  // simple: PropTypes.bool,
  // settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
