define([
  'underscore'
], function(
  _
) {

  /**
  * List of the key languages of the platform
  */

  var datasetList = {
    'glad-alerts': {
      title: 'GLAD tree cover loss alerts',
      long_title: 'weekly GLAD tree cover loss alerts',
      sub_title: 'weekly, 30m, select countries, UMD/GLAD',
      layerSlug: ['umd_as_it_happens'],
      slug: 'glad-alerts',
      slug_source: 'umd_landsat_alerts',
      order: 10
    },
    'terrai-alerts': {
      title: 'Terra-i tree cover loss alerts',
      long_title: 'monthly Terra-i tree cover loss alerts',
      sub_title: 'monthly, 250m, humid tropics, CIAT',
      layerSlug: ['terrailoss'],
      slug: 'terrai-alerts',
      slug_source: 'terra_i_alerts',
      order: 20
    },
    'imazon-alerts': {
      title: 'SAD tree cover loss alerts',
      long_title: 'monthly SAD tree cover loss alerts',
      sub_title: 'monthly, 250m, Brazilian Amazon, Imazon',
      layerSlug: ['imazon'],
      slug: 'imazon-alerts',
      slug_source: 'imazon_sad',
      order: 30
    },
    'viirs-active-fires': {
      title: 'VIIRS active fires alerts',
      long_title: 'daily VIIRS active fires alerts',
      sub_title: 'updated two times daily, 375m, global, NASA',
      layerSlug: ['viirs_fires_alerts'],
      slug: 'viirs-active-fires',
      slug_source: 'viirs_fires',
      order: 40
    },
    'guira-loss': {
      title: 'Gran Chaco deforestation data',
      long_title: 'monthly Gran Chaco deforestation data',
      sub_title: 'monthly, 30m, Gran Chaco, Guyra',
      layerSlug: ['guyra'],
      slug: 'guira-loss',
      slug_source: 'gran_chaco_deforestation',
      order: 50
    },
    'umd-loss-gain': {
      title: 'Tree cover loss data',
      long_title: 'annual tree cover loss data',
      sub_title: 'annual, 30m, global, Hansen/UMD/Google/USGS/NASA',
      layerSlug: ['loss','gain'],
      slug: 'umd-loss-gain',
      slug_source: 'tree_cover_loss',
      order: 60
    },
    'prodes-loss': {
      title: 'PRODES deforestation data',
      long_title: 'annual PRODES deforestation data',
      sub_title: 'annual, 30m, Brazilian Amazon, INPE',
      layerSlug: ['prodes'],
      slug: 'prodes-loss',
      slug_source: 'prodes',
      order: 70
    }
  };

  var datasetHelper = {

    /**
     * Returns the list of key datasets
     * @returns {Object} key languages list
     */
    getList: function() {
      return datasetList;
    },

    /**
     * Returns a filtered list of key datasets
     * @param {Object} datasets slugs
     * @returns {Object} key languages list
     */
    getFilteredList: function(datasets) {
      var filteredDatasets = [];

      // Global layers
      filteredDatasets.push(datasetList['umd-loss-gain']);
      filteredDatasets.push(datasetList['viirs-active-fires']);

      if (datasets) {
        for (var dataset in datasetList) {
          if (datasets.indexOf(datasetList[dataset].layerSlug[0]) !== -1) {
            filteredDatasets.push(datasetList[dataset]);
          }
        }
      }

      filteredDatasets = _.sortBy(filteredDatasets, function(data) {
        return data.order;
      })

      return filteredDatasets;
    },

    /**
     * Returns a list of the key datasets
     * with the selected option passed by param
     * @param {string} selected language
     * @returns {Array} list of languages with selection
     */
    getListSelected: function(selectedDatasets) {
      var selectedList = {};
      for (var dataset in datasetList) {
        selectedList[dataset] = _.extend({}, datasetList[dataset]);

        if (selectedDatasets && selectedDatasets.indexOf(dataset) != -1) {
          selectedList[dataset].checked = true
        }
      }
      return selectedList;
    }

  }

  return datasetHelper;

});
