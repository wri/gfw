/**
 * Map layers slug with layer files. (like views and dialog templates)
 */
define([
  // Layer views
  'map/views/layers/UMDLossLayer',
  'map/views/layers/ForestGainLayer',
  'map/views/layers/FormaLayer',
  'map/views/layers/FormaCoverLayer',
  'map/views/layers/ImazonLayer',
  'map/views/layers/ImazonCoverLayer',
  'map/views/layers/ModisLayer',
  'map/views/layers/ModisCoverLayer',
  'map/views/layers/FiresLayer',
  'map/views/layers/Forest2000Layer',
  'map/views/layers/IntactForestLayer',
  'map/views/layers/IntactForestLayer2000',
  'map/views/layers/IntactForestLayer2013',
  'map/views/layers/PantropicalLayer',
  'map/views/layers/IdnPrimaryLayer',
  'map/views/layers/LoggingLayer',
  'map/views/layers/MiningLayer',
  'map/views/layers/OilPalmLayer',
  'map/views/layers/WoodFiberPlantationsLayer',
  'map/views/layers/ProtectedAreasLayer',
  'map/views/layers/BiodiversityHotspotsLayer',
  'map/views/layers/ResourceRightsLayer',
  'map/views/layers/LandRightsLayer',
  'map/views/layers/UserStoriesLayer',
  'map/views/layers/MongabayStoriesLayer',
  'map/views/layers/InfoamazoniaStoriesLayer',
  // Layer dialog templates
  'text!templates/dialogs/umd_tree_loss_gain_dialog.handlebars'
], function(
  // Layer Views
  UMDLossLayer,
  ForestGainLayer,
  FormaLayer,
  FormaCoverLayer,
  ImazonLayer,
  ImazonCoverLayer,
  ModisLayer,
  ModisCoverLayer,
  FiresLayer,
  Forest2000Layer,
  IntactForestLayer,
  IntactForestLayer2000,
  IntactForestLayer2013,
  PantropicalLayer,
  IdnPrimaryLayer,
  LoggingLayer,
  MiningLayer,
  OilPalmLayer,
  WoodFiberPlantationsLayer,
  ProtectedAreasLayer,
  BiodiversityHotspotsLayer,
  ResourceRightsLayer,
  LandRightsLayer,
  UserStoriesLayer,
  MongabayStoriesLayer,
  InfoamazoniaStoriesLayer,
  // Layer dialog templates
  umd_tree_loss_gain_dialog) {

  'use strict';

  var layersHelper = {
    umd_tree_loss_gain: {
      view: UMDLossLayer,
      dialogTpl: umd_tree_loss_gain_dialog
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
    forest2000: {
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
    },
    nothing: {
    }
  };

  return layersHelper;

});
