define([], function() {

  /**
  * List of the key languages of the platform
  */

  var datasetList = {
    'umd-loss-gain': {
      title: 'Tree cover loss',
      long_title: 'annual tree cover loss data',
      sub_title: 'annual, 30m, global, Hansen/UMD/Google/USGS/NASA',
      layerSlug: ['loss','gain'],
      slug: 'umd-loss-gain',
      slug_source: 'tree_cover_loss'
    },
    'terrai-alerts': {
      title: 'Terra-i Alerts',
      long_title: 'monthly Terra-i tree cover loss alerts',
      sub_title: 'monthly, 250m, Latin America, CIAT',
      layerSlug: ['terrailoss'],
      slug: 'terrai-alerts',
      slug_source: 'terra_i_alerts'
    },
    'imazon-alerts': {
      title: 'SAD Alerts',
      long_title: 'monthly SAD tree cover loss alerts',
      sub_title: 'monthly, 250m, Brazilian Amazon, Imazon',
      layerSlug: ['imazon'],
      slug: 'imazon-alerts',
      slug_source: 'imazon_sad'
    },
    'prodes-loss': {
      title: 'PRODES deforestation',
      long_title: 'annual PRODES deforestation data',
      sub_title: 'annual, 30m, Brazilian Amazon, INPE',
      layerSlug: ['prodes'],
      slug: 'prodes-loss',
      slug_source: 'prodes'
    },
    'guira-loss': {
      title: 'Gran Chaco deforestation',
      long_title: 'monthly Gran Chaco deforestation data',
      sub_title: 'monthly, 30m, Gran Chaco, Guyra',
      layerSlug: ['guyra'],
      slug: 'guira-loss',
      slug_source: 'gran_chaco_deforestation'
    },
    'glad-alerts': {
      title: 'GLAD Tree Cover Loss Alerts',
      long_title: 'weekly GLAD tree cover loss alerts',
      sub_title: 'weekly, 30m, select countries, UMD/GLAD',
      layerSlug: ['umd_as_it_happens'],
      slug: 'glad-alerts',
      slug_source: 'umd_landsat_alerts'
    },
    'viirs-active-fires': {
      title: 'VIIRS Active fires',
      long_title: 'daily VIIRS active fires alerts',
      sub_title: 'daily, 375 m, global, NASA',
      layerSlug: ['viirs_fires_alerts'],
      slug: 'viirs-active-fires',
      slug_source: 'viirs_fires'
    }
  };

  var datasetHelper = {

    /**
     * Returns the list of key datasets
     * @returns {Object} key languages list
     */
    getList: function() {
      return datasetList;
    }
  }

  return datasetHelper;

});
