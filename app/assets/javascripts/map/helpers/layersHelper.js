/**
 * Map layers slug with layer files. (like views and dialog templates)
 */
define([
  // Layer views
  'map/views/layers/LossLayer',
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
  'map/views/layers/CafLoggingLayer',
  'map/views/layers/CanLoggingLayer',
  'map/views/layers/CmrLoggingLayer',
  'map/views/layers/CodLoggingLayer',
  'map/views/layers/GabLoggingLayer',
  'map/views/layers/GnqLoggingLayer',
  'map/views/layers/IdnLoggingLayer',
  'map/views/layers/LbrLoggingLayer',
  'map/views/layers/MiningLayer',
  'map/views/layers/CanClaimsMiningLayer',
  'map/views/layers/CanCoalMiningLayer',
  'map/views/layers/CanLeasesMiningLayer',
  'map/views/layers/CanPermitsMiningLayer',
  'map/views/layers/CmrMiningLayer',
  'map/views/layers/CodMiningLayer',
  'map/views/layers/CogMiningLayer',
  'map/views/layers/GabMiningLayer',
  'map/views/layers/OilPalmLayer',
  'map/views/layers/CogOilPalmLayer',
  'map/views/layers/LbrOilPalmLayer',
  'map/views/layers/CmrOilPalmLayer',
  'map/views/layers/IdnOilPalmLayer',
  'map/views/layers/WoodFiberPlantationsLayer',
  'map/views/layers/GabWoodFiberPlantationsLayer',
  'map/views/layers/CogWoodFiberPlantationsLayer',
  'map/views/layers/IdnWoodFiberPlantationsLayer',
  'map/views/layers/ProtectedAreasLayer',
  'map/views/layers/ProtectedAreasCDBLayer',
  'map/views/layers/BiodiversityHotspotsLayer',
  'map/views/layers/ResourceRightsLayer',
  'map/views/layers/CmrResourceRightsLayer',
  'map/views/layers/LbrResourceRightsLayer',
  'map/views/layers/GnqResourceRightsLayer',
  'map/views/layers/NamResourceRightsLayer',
  'map/views/layers/LandRightsLayer',
  'map/views/layers/AusLandRightsLayer',
  'map/views/layers/PanLandRightsLayer',
  'map/views/layers/BraLandRightsLayer',
  'map/views/layers/CanLandRightsLayer',
  'map/views/layers/UserStoriesLayer',
  'map/views/layers/MongabayStoriesLayer',
  'map/views/layers/InfoamazoniaStoriesLayer',
  'map/views/layers/GrumpLayer',
  'map/views/layers/MangroveLayer',
  'map/views/layers/WMSLayer',
  'map/views/layers/ConcesionesForestalesLayer',
  'map/views/layers/ConcesionesForestalesNotSupervisedLayer',
  'map/views/layers/TerraiCanvasLayer',
  'map/views/layers/TerraicanvasCoverageLayer',
  'map/views/layers/WWFLayer',
  'map/views/layers/BirdlifeLayer',
  'map/views/layers/AzepolyLayer',
  'map/views/layers/TigersLayer',
  'map/views/layers/CarbonLayer',
  'map/views/layers/DamHotspotsLayer',
  'map/views/layers/ColombiaForestChangeLayer',
  // Layer dialog templates
  // 'text!templates/dialogs/loss_dialog.handlebars',
  // Layers timelines
  'map/views/timeline/LossTimeline',
  'map/views/timeline/FormaTimeline',
  'map/views/timeline/ImazonTimeline',
  'map/views/timeline/ModisTimeline',
  'map/views/timeline/FiresTimeline',
  'map/views/timeline/TerraiTimeline',
], function(
  // Layer Views
  LossLayer,
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
  CafLoggingLayer,
  CanLoggingLayer,
  CmrLoggingLayer,
  CodLoggingLayer,
  GabLoggingLayer,
  GnqLoggingLayer,
  IdnLoggingLayer,
  LbrLoggingLayer,
  MiningLayer,
  CanClaimsMiningLayer,
  CanCoalMiningLayer,
  CanLeasesMiningLayer,
  CanPermitsMiningLayer,
  CmrMiningLayer,
  CodMiningLayer,
  CogMiningLayer,
  GabMiningLayer,
  OilPalmLayer,
  CogOilPalmLayer,
  LbrOilPalmLayer,
  CmrOilPalmLayer,
  IdnOilPalmLayer,
  WoodFiberPlantationsLayer,
  GabWoodFiberPlantationsLayer,
  CogWoodFiberPlantationsLayer,
  IdnWoodFiberPlantationsLayer,
  ProtectedAreasLayer,
  ProtectedAreasCDBLayer,
  BiodiversityHotspotsLayer,
  ResourceRightsLayer,
  CmrResourceRightsLayer,
  LbrResourceRightsLayer,
  GnqResourceRightsLayer,
  NamResourceRightsLayer,
  LandRightsLayer,
  AusLandRightsLayer,
  PanLandRightsLayer,
  BraLandRightsLayer,
  CanLandRightsLayer,
  UserStoriesLayer,
  MongabayStoriesLayer,
  InfoamazoniaStoriesLayer,
  GrumpLayer,
  MangroveLayer,
  WMSLayer,
  ConcesionesForestalesLayer,
  ConcesionesForestalesNotSupervisedLayer,
  TerraiCanvasLayer,
  TerraicanvasCoverageLayer,
  WWFLayer,
  BirdlifeLayer,
  AzepolyLayer,
  TigersLayer,
  CarbonLayer,
  DamHotspotsLayer,
  ColombiaForestChangeLayer,
  // Layer dialog templates
  // loss_dialog,
  // Layer timelines
  LossTimeline,
  FormaTimeline,
  ImazonTimeline,
  ModisTimeline,
  FiresTimeline,
  TerraiTimeline) {

  'use strict';

  var layersHelper = {
    loss: {
      view: LossLayer,
      timelineView: LossTimeline
    },
    forestgain: {
      view: ForestGainLayer
    },
    forma: {
      view: FormaLayer,
      timelineView: FormaTimeline
    },
    forma_cover: {
      view: FormaCoverLayer
    },
    imazon: {
      view: ImazonLayer,
      timelineView: ImazonTimeline
    },
    imazon_cover: {
      view: ImazonCoverLayer
    },
    modis: {
      view: ModisLayer,
      timelineView: ModisTimeline
    },
    modis_cover: {
      view: ModisCoverLayer
    },
    fires: {
      view: FiresLayer,
      timelineView: FiresTimeline
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
    caf_logging: {
      view: CafLoggingLayer
    },
    can_logging: {
      view: CanLoggingLayer
    },
    cmr_logging: {
      view: CmrLoggingLayer
    },
    cod_logging: {
      view: CodLoggingLayer
    },
    gab_logging: {
      view: GabLoggingLayer
    },
    gnq_logging: {
      view: GnqLoggingLayer
    },
    idn_logging: {
      view: IdnLoggingLayer
    },
    lbr_logging: {
      view: LbrLoggingLayer
    },
    mining: {
      view: MiningLayer
    },
    can_claims: {
      view: CanClaimsMiningLayer
    },
    can_coal: {
      view: CanCoalMiningLayer
    },
    can_leases: {
      view: CanLeasesMiningLayer
    },
    can_permits: {
      view: CanPermitsMiningLayer
    },
    cmr_mining: {
      view: CmrMiningLayer
    },
    cod_mining: {
      view: CodMiningLayer
    },
    cog_mining: {
      view: CogMiningLayer
    },
    gab_mining: {
      view: GabMiningLayer
    },
    oil_palm: {
      view: OilPalmLayer
    },
    cog_oil_palm: {
      view: CogOilPalmLayer
    },
    lbr_oil_palm: {
      view: LbrOilPalmLayer
    },
    cmr_oil_palm: {
      view: CmrOilPalmLayer
    },
    idn_oil_palm: {
      view: IdnOilPalmLayer
    },
    wood_fiber_plantations: {
      view: WoodFiberPlantationsLayer
    },
    cog_wood_fiber: {
      view: CogWoodFiberPlantationsLayer
    },
    gab_wood_fiber: {
      view: GabWoodFiberPlantationsLayer
    },
    idn_wood_fiber: {
      view: IdnWoodFiberPlantationsLayer
    },
    protected_areas: {
      view: ProtectedAreasLayer
    },
    protected_areasCDB: {
      view: ProtectedAreasCDBLayer
    },
    biodiversity_hotspots: {
      view: BiodiversityHotspotsLayer
    },
    resource_rights: {
      view: ResourceRightsLayer
    },
    cmr_resource_rights: {
      view: CmrResourceRightsLayer
    },
    lbr_resource_rights: {
      view: LbrResourceRightsLayer
    },
    gnq_resource_rights: {
      view: GnqResourceRightsLayer
    },
    nam_resource_rights: {
      view: NamResourceRightsLayer
    },
    land_rights: {
      view: LandRightsLayer
    },
    aus_land_rights: {
      view: AusLandRightsLayer
    },
    pan_land_rights: {
      view: PanLandRightsLayer
    },
    bra_land_rights: {
      view: BraLandRightsLayer
    },
    can_land_rights: {
      view: CanLandRightsLayer
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
    grump2000 :{
      view: GrumpLayer
    },
    mangrove :{
      view: MangroveLayer
    },
    WMSLayer :{
      view: WMSLayer
    },
    concesiones_forestales :{
      view: ConcesionesForestalesLayer
    },
    concesiones_forestalesNS :{
      view: ConcesionesForestalesNotSupervisedLayer
    },
    terrailoss :{
      view: TerraiCanvasLayer,
      timelineView: TerraiTimeline
    },
    terraicanvas_cover :{
      view: TerraicanvasCoverageLayer
    },
    wwf: {
      view: WWFLayer
    },
    birdlife: {
      view: BirdlifeLayer
    },
    azepoly: {
      view: AzepolyLayer
    },
    tigers: {
      view: TigersLayer
    },
    verified_carbon: {
      view: CarbonLayer
    },
    colombia_forest_change: {
      view: ColombiaForestChangeLayer
    },
    dam_hotspots: {
      view: DamHotspotsLayer
    },
    nothing: {
    }
  };

  return layersHelper;

});
