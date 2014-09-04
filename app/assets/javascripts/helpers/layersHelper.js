/**
 * Map layers slug with layer files. (like views and dialog templates)
 */
define([
  'views/layers/UMDLossLayer',
  'views/layers/ForestGainLayer',
  'views/layers/FormaLayer',
  'views/layers/FormaCoverLayer',
  'views/layers/ImazonLayer',
  'views/layers/ImazonCoverLayer',
  'views/layers/ModisLayer',
  'views/layers/ModisCoverLayer',
  'views/layers/FiresLayer',
  'views/layers/Forest2000Layer',
  'views/layers/IntactForestLayer',
  'views/layers/IntactForestLayer2000',
  'views/layers/IntactForestLayer2013',
  'views/layers/PantropicalLayer',
  'views/layers/IdnPrimaryLayer',
  'views/layers/LoggingLayer',
  'views/layers/MiningLayer',
  'views/layers/OilPalmLayer',
  'views/layers/WoodFiberPlantationsLayer',
  'views/layers/ProtectedAreasLayer',
  'views/layers/BiodiversityHotspotsLayer',
  'views/layers/ResourceRightsLayer',
  'views/layers/LandRightsLayer',
  'views/layers/UserStoriesLayer',
  'views/layers/MongabayStoriesLayer',
  'views/layers/InfoamazoniaStoriesLayer'
], function(UMDLossLayer, ForestGainLayer, FormaLayer, FormaCoverLayer, ImazonLayer, ImazonCoverLayer,
  ModisLayer, ModisCoverLayer, FiresLayer, Forest2000Layer, IntactForestLayer, IntactForestLayer2000,
  IntactForestLayer2013, PantropicalLayer, IdnPrimaryLayer, LoggingLayer, MiningLayer, OilPalmLayer,
  WoodFiberPlantationsLayer, ProtectedAreasLayer, BiodiversityHotspotsLayer, ResourceRightsLayer,
  LandRightsLayer, UserStoriesLayer, MongabayStoriesLayer, InfoamazoniaStoriesLayer) {

  'use strict';

  var layersHelper = {
    umd_tree_loss_gain: {
      view: UMDLossLayer
    },
    forestgain: {
      view: ForestGainLayer
    },
    forma: {
      view: FormaLayer
    },
    forma_cover: {
      view: FormaCoverLayer
    },
    imazon: {
      view: ImazonLayer
    },
    imazon_cover: {
      view: ImazonCoverLayer
    },
    modis: {
      view: ModisLayer
    },
    modis_cover: {
      view: ModisCoverLayer
    },
    fires: {
      view: FiresLayer
    },
    Forest2000Layer: {
      view: Forest2000Layer
    },
    intact_forest: {
      view: IntactForestLayer
    },
    ifl_2000: {
      view: IntactForestLayer2000
    },
    ifl_2013_deg: {
      view: IntactForestLayer2013
    },
    pantropical: {
      view: PantropicalLayer
    },
    idn_primary: {
      view: IdnPrimaryLayer
    },
    logging: {
      view: LoggingLayer
    },
    mining: {
      view: MiningLayer
    },
    oil_palm: {
      view: OilPalmLayer
    },
    wood_fiber_plantations: {
      view: WoodFiberPlantationsLayer
    },
    protected_areas: {
      view: ProtectedAreasLayer
    },
    biodiversity_hotspots: {
      view: BiodiversityHotspotsLayer
    },
    resource_rights: {
      view: ResourceRightsLayer
    },
    land_rights: {
      view: LandRightsLayer
    },
    user_stories: {
      view: UserStoriesLayer
    },
    mongabay: {
      view: MongabayStoriesLayer
    },
    infoamazonia: {
      view: InfoamazoniaStoriesLayer
    }
  };

  return layersHelper;

});
