/**
 * Map layers slug with layer files. (like views and dialog templates)
 */

/* eslint-disable */

define(
  [
    // Layer views
    'map/views/layers/LossLayer',
    'map/views/layers/LossByDriverLayer',
    'map/views/layers/ForestGainLayer',
    'map/views/layers/FormaMonth3Layer',
    'map/views/layers/FormaActivityLayer',
    'map/views/layers/FormaCoverageLayer',
    'map/views/layers/ImazonLayer',
    'map/views/layers/ImazonCoverLayer',
    'map/views/layers/Forest2000Layer',
    'map/views/layers/Forest2010Layer',
    'map/views/layers/IntactForestLayer',
    'map/views/layers/IntactForestLayer2000',
    'map/views/layers/IntactForestLayer2013',
    'map/views/layers/PrimaryForestLayer',
    'map/views/layers/PantropicalLayer',
    'map/views/layers/IdnPrimaryLayer',
    'map/views/layers/LoggingLayer',
    'map/views/layers/CafLoggingLayer',
    'map/views/layers/CanLoggingLayer',
    'map/views/layers/CmrLoggingLayer',
    'map/views/layers/CodLoggingLayer',
    'map/views/layers/GabLoggingLayer',
    'map/views/layers/GnqLoggingLayer',
    'map/views/layers/IdnLandCoverLayer',
    'map/views/layers/IdnForestArea',
    'map/views/layers/IdnLoggingLayer',
    'map/views/layers/LbrLoggingLayer',
    'map/views/layers/CogLoggingLayer',
    'map/views/layers/MysLoggingLayer',
    'map/views/layers/MiningLayer',
    'map/views/layers/CanOilLayer',
    'map/views/layers/CanMiningLayer',
    'map/views/layers/CmrMiningLayer',
    'map/views/layers/CodMiningLayer',
    'map/views/layers/CogMiningLayer',
    'map/views/layers/GabMiningLayer',
    'map/views/layers/ColMiningLayer',
    'map/views/layers/KhmMiningLayer',
    'map/views/layers/OilPalmLayer',
    'map/views/layers/RSPOLayer',
    'map/views/layers/IdnSuitabilityLayer',
    'map/views/layers/CogOilPalmLayer',
    'map/views/layers/LbrOilPalmLayer',
    'map/views/layers/CmrOilPalmLayer',
    'map/views/layers/IdnOilPalmLayer',
    'map/views/layers/MysOilPalmLayer',
    'map/views/layers/WoodFiberPlantationsLayer',
    'map/views/layers/GabWoodFiberPlantationsLayer',
    'map/views/layers/CogWoodFiberPlantationsLayer',
    'map/views/layers/IdnWoodFiberPlantationsLayer',
    'map/views/layers/MysWoodFiberPlantationsLayer',
    'map/views/layers/ProtectedAreasLayer',
    'map/views/layers/ProtectedAreasCDBLayer',
    'map/views/layers/BiodiversityHotspotsLayer',
    'map/views/layers/BiodiversityIntactnessLayer',
    'map/views/layers/BiodiversityCompletenessLayer',
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
    'map/views/layers/CriLandRightsLayer',
    'map/views/layers/NzlLandRightsLayer',
    'map/views/layers/UserStoriesLayer',
    'map/views/layers/MongabayStoriesLayer',
    'map/views/layers/InfoamazoniaStoriesLayer',
    'map/views/layers/GrumpLayer',
    'map/views/layers/Mangrove2Layer',
    'map/views/layers/MangroveWatchLayer',
    'map/views/layers/WMSLayer',
    'map/views/layers/ConcesionesForestalesLayer',
    'map/views/layers/ConcesionesForestalesNotSupervisedLayer',
    'map/views/layers/TerraiCanvasLayer',
    'map/views/layers/TerraiCoverageLayer',
    'map/views/layers/WWFLayer',
    'map/views/layers/BirdlifeLayer',
    'map/views/layers/AzepolyLayer',
    'map/views/layers/TigersLayer',
    'map/views/layers/MexicanProtectedAreasLayer',
    'map/views/layers/CarbonLayer',
    'map/views/layers/DamHotspotsLayer',
    'map/views/layers/PalmOilMillsLayer',
    'map/views/layers/ColombiaForestChangeLayer',
    'map/views/layers/UsaConservationEasementsLayer',
    'map/views/layers/UsaLandCoverLayer',
    'map/views/layers/UsaLandCoverChangeLayer',
    'map/views/layers/GlobalLandCoverLayer',
    'map/views/layers/BraBiomesLayer',
    'map/views/layers/IdnLeuserLayer',
    'map/views/layers/ProdesLayer',
    'map/views/layers/ProdesCoverLayer',
    'map/views/layers/PerPermForestLayer',
    'map/views/layers/RaisgLayer',
    'map/views/layers/PlantationsLayerByType',
    'map/views/layers/PlantationsLayerBySpecies',
    'map/views/layers/BraMapBiomasLayer',
    'map/views/layers/BraPlantationsLayerByType',
    'map/views/layers/BraPlantationsLayerBySpecies',
    'map/views/layers/PerPlantationsLayerByType',
    'map/views/layers/PerPlantationsLayerBySpecies',
    'map/views/layers/LbrPlantationsLayerByType',
    'map/views/layers/LbrPlantationsLayerBySpecies',
    'map/views/layers/ColPlantationsLayerByType',
    'map/views/layers/ColPlantationsLayerBySpecies',
    'map/views/layers/KhmPlantationsLayerByType',
    'map/views/layers/KhmPlantationsLayerBySpecies',
    'map/views/layers/IdnPlantationsLayerByType',
    'map/views/layers/IdnPlantationsLayerBySpecies',
    'map/views/layers/MysPlantationsLayerByType',
    'map/views/layers/MysPlantationsLayerBySpecies',
    'map/views/layers/PerBufferLayer',
    'map/views/layers/PerNatPALayer',
    'map/views/layers/PerPrivPALayer',
    'map/views/layers/PerRegPALayer',
    'map/views/layers/IdnForMorLayer',
    'map/views/layers/GtmForestChange1Layer',
    'map/views/layers/GtmForestChange2Layer',
    'map/views/layers/GtmForestCoverLayer',
    'map/views/layers/GtmForestDensityLayer',
    'map/views/layers/GladLayer',
    'map/views/layers/LandsatAlertsCoverLayer',
    'map/views/layers/GladCoverageLayer',
    'map/views/layers/KhmProtectedAreasLayer',
    'map/views/layers/KhmEcoLandLayer',
    'map/views/layers/UsaForestOwnershipLayer',
    'map/views/layers/GuyraLayer',
    'map/views/layers/LoggingRoadsLayer',
    'map/views/layers/LoggingRoadsCoverLayer',
    'map/views/layers/RusHcvLayer',
    'map/views/layers/DrcPrimaryForestLayer',
    'map/views/layers/GuyraCoverLayer',
    'map/views/layers/MysPALayer',
    'map/views/layers/IdnPeatLandsLayer',
    'map/views/layers/MysPeatLandsLayer',
    'map/views/layers/RaisgMiningLayer',
    'map/views/layers/PerMiningLayer',
    'map/views/layers/MexMiningLayer',
    'map/views/layers/BraMiningLayer',
    'map/views/layers/BraSoyCerradoLayer',
    'map/views/layers/BraRTRSLayer',
    'map/views/layers/PryRTRSLayer',
    'map/views/layers/ViirsLayer',
    'map/views/layers/PerMinamCoverLayer',
    'map/views/layers/CanIntactForestLayer',
    'map/views/layers/MexForestCatLayer',
    'map/views/layers/MexForestSubCatLayer',
    'map/views/layers/Places2WatchLayer',
    'map/views/layers/UncuratedPlaces2WatchLayer',
    'map/views/layers/MexicoPaymentsLayer',
    'map/views/layers/MexLandRightsLayer',
    'map/views/layers/BraLoggingLayer',
    'map/views/layers/MysWoodFiberSabahLayer',
    'map/views/layers/MysLoggingSabahLayer',
    'map/views/layers/MysPASabahLayer',
    'map/views/layers/PerPALayer',
    'map/views/layers/MexLandCoverLayer',
    'map/views/layers/MexForestConservLayer',
    'map/views/layers/MexForestProdLayer',
    'map/views/layers/MexForestRestLayer',
    'map/views/layers/UgaPALayer',
    'map/views/layers/CanProtectedAreasLayer',
    'map/views/layers/LbrMinExL',
    'map/views/layers/LbrMinDevAg',
    'map/views/layers/LbrDevExL',
    'map/views/layers/PakUserMangrovesLayer',
    'map/views/layers/SenUserProtectedAreasLayer',
    'map/views/layers/HaitiWatershedLayer',
    'map/views/layers/EcuUserProtectedAreasLayer',
    'map/views/layers/BolUserFireFrequencyLayer',
    'map/views/layers/RecentImageryLayer',
    // Layer dialog templates
    // 'text!templates/dialogs/loss_dialog.handlebars',
    // Layers timelines
    'map/views/timeline/LossTimeline',
    'map/views/timeline/FormaTimeline',
    'map/views/timeline/FormaActivityTimeline',
    'map/views/timeline/ImazonTimeline',
    'map/views/timeline/FiresTimeline',
    'map/views/timeline/TerraiTimeline',
    'map/views/timeline/ProdesTimeline',
    'map/views/timeline/GuyraTimeline',
    'map/views/timeline/GladTimeline',
    'map/views/timeline/MangroveTimeline'
  ],
  function(
    // Layer Views
    LossLayer,
    LossByDriverLayer,
    ForestGainLayer,
    FormaMonth3Layer,
    FormaActivityLayer,
    FormaCoverageLayer,
    ImazonLayer,
    ImazonCoverLayer,
    Forest2000Layer,
    Forest2010Layer,
    IntactForestLayer,
    IntactForestLayer2000,
    IntactForestLayer2013,
    PrimaryForestLayer,
    PantropicalLayer,
    IdnPrimaryLayer,
    LoggingLayer,
    CafLoggingLayer,
    CanLoggingLayer,
    CmrLoggingLayer,
    CodLoggingLayer,
    GabLoggingLayer,
    GnqLoggingLayer,
    IdnLandCoverLayer,
    IdnForestArea,
    IdnLoggingLayer,
    LbrLoggingLayer,
    CogLoggingLayer,
    MysLoggingLayer,
    MiningLayer,
    CanOilLayer,
    CanMiningLayer,
    CmrMiningLayer,
    CodMiningLayer,
    CogMiningLayer,
    GabMiningLayer,
    ColMiningLayer,
    KhmMiningLayer,
    OilPalmLayer,
    RSPOLayer,
    IdnSuitabilityLayer,
    CogOilPalmLayer,
    LbrOilPalmLayer,
    CmrOilPalmLayer,
    IdnOilPalmLayer,
    MysOilPalmLayer,
    WoodFiberPlantationsLayer,
    GabWoodFiberPlantationsLayer,
    CogWoodFiberPlantationsLayer,
    IdnWoodFiberPlantationsLayer,
    MysWoodFiberPlantationsLayer,
    ProtectedAreasLayer,
    ProtectedAreasCDBLayer,
    BiodiversityHotspotsLayer,
    BiodiversityIntactnessLayer,
    BiodiversityCompletenessLayer,
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
    CriLandRightsLayer,
    NzlLandRightsLayer,
    UserStoriesLayer,
    MongabayStoriesLayer,
    InfoamazoniaStoriesLayer,
    GrumpLayer,
    Mangrove2Layer,
    MangroveWatchLayer,
    WMSLayer,
    ConcesionesForestalesLayer,
    ConcesionesForestalesNotSupervisedLayer,
    TerraiCanvasLayer,
    TerraiCoverageLayer,
    WWFLayer,
    BirdlifeLayer,
    AzepolyLayer,
    TigersLayer,
    MexicanProtectedAreasLayer,
    CarbonLayer,
    DamHotspotsLayer,
    PalmOilMillsLayer,
    ColombiaForestChangeLayer,
    UsaConservationEasementsLayer,
    UsaLandCoverLayer,
    UsaLandCoverChangeLayer,
    GlobalLandCoverLayer,
    BraBiomesLayer,
    IdnLeuserLayer,
    ProdesLayer,
    ProdesCoverLayer,
    PerPermForestLayer,
    RaisgLayer,
    PlantationsLayerByType,
    PlantationsLayerBySpecies,
    BraMapBiomasLayer,
    BraPlantationsLayerByType,
    BraPlantationsLayerBySpecies,
    PerPlantationsLayerByType,
    PerPlantationsLayerBySpecies,
    LbrPlantationsLayerByType,
    LbrPlantationsLayerBySpecies,
    ColPlantationsLayerByType,
    ColPlantationsLayerBySpecies,
    KhmPlantationsLayerByType,
    KhmPlantationsLayerBySpecies,
    IdnPlantationsLayerByType,
    IdnPlantationsLayerBySpecies,
    MysPlantationsLayerByType,
    MysPlantationsLayerBySpecies,
    PerBufferLayer,
    PerNatPALayer,
    PerPrivPALayer,
    PerRegPALayer,
    IdnForMorLayer,
    GtmForestChange1Layer,
    GtmForestChange2Layer,
    GtmForestCoverLayer,
    GtmForestDensityLayer,
    GladLayer,
    LandsatAlertsCoverLayer,
    GladCoverageLayer,
    KhmProtectedAreasLayer,
    KhmEcoLandLayer,
    UsaForestOwnershipLayer,
    GuyraLayer,
    LoggingRoadsLayer,
    LoggingRoadsCoverLayer,
    RusHcvLayer,
    DrcPrimaryForestLayer,
    GuyraCoverLayer,
    MysPALayer,
    IdnPeatLandsLayer,
    MysPeatLandsLayer,
    RaisgMiningLayer,
    PerMiningLayer,
    MexMiningLayer,
    BraMiningLayer,
    BraSoyCerradoLayer,
    BraRTRSLayer,
    PryRTRSLayer,
    ViirsLayer,
    PerMinamCoverLayer,
    CanIntactForestLayer,
    MexForestCatLayer,
    MexForestSubCatLayer,
    Places2WatchLayer,
    UncuratedPlaces2WatchLayer,
    MexicoPaymentsLayer,
    MexLandRightsLayer,
    BraLoggingLayer,
    MysWoodFiberSabahLayer,
    MysLoggingSabahLayer,
    MysPASabahLayer,
    PerPALayer,
    MexLandCoverLayer,
    MexForestConservLayer,
    MexForestProdLayer,
    MexForestRestLayer,
    UgaPALayer,
    CanProtectedAreasLayer,
    LbrMinExL,
    LbrMinDevAg,
    LbrDevExL,
    PakUserMangrovesLayer,
    SenUserProtectedAreasLayer,
    HaitiWatershedLayer,
    EcuUserProtectedAreasLayer,
    BolUserFireFrequencyLayer,
    RecentImageryLayer,
    // Layer dialog templates
    // loss_dialog,
    // Layer timelines
    LossTimeline,
    FormaTimeline,
    FormaActivityTimeline,
    ImazonTimeline,
    FiresTimeline,
    TerraiTimeline,
    ProdesTimeline,
    GuyraTimeline,
    GladTimeline,
    MangroveTimeline
  ) {
    var layersHelper = {
      loss: {
        view: LossLayer,
        timelineView: LossTimeline
      },
      loss_by_driver: {
        view: LossByDriverLayer,
        timelineView: LossTimeline
      },
      forestgain: {
        view: ForestGainLayer
      },
      forma_month_3: {
        view: FormaMonth3Layer,
        timelineView: FormaTimeline
      },
      forma_activity: {
        view: FormaActivityLayer,
        timelineView: FormaActivityTimeline
      },
      forma_coverage: {
        view: FormaCoverageLayer
      },
      imazon: {
        view: ImazonLayer,
        timelineView: ImazonTimeline
      },
      imazon_cover: {
        view: ImazonCoverLayer
      },
      viirs_fires_alerts: {
        view: ViirsLayer,
        timelineView: FiresTimeline
      },
      forest2000: {
        view: Forest2000Layer
      },
      forest2010: {
        view: Forest2010Layer
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
      primary_forest: {
        view: PrimaryForestLayer
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
      idn_land_cover: {
        view: IdnLandCoverLayer
      },
      idn_forest_area: {
        view: IdnForestArea
      },
      idn_logging: {
        view: IdnLoggingLayer
      },
      lbr_logging: {
        view: LbrLoggingLayer
      },
      cog_logging: {
        view: CogLoggingLayer
      },
      mys_logging: {
        view: MysLoggingLayer
      },
      mining: {
        view: MiningLayer
      },
      can_oil: {
        view: CanOilLayer
      },
      can_mining: {
        view: CanMiningLayer
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
      col_mining: {
        view: ColMiningLayer
      },
      khm_mining: {
        view: KhmMiningLayer
      },
      oil_palm: {
        view: OilPalmLayer
      },
      rspo_oil_palm: {
        view: RSPOLayer
      },
      idn_suitability: {
        view: IdnSuitabilityLayer
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
      mys_oil_palm: {
        view: MysOilPalmLayer
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
      mys_wood_fiber: {
        view: MysWoodFiberPlantationsLayer
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
      biodiversity_intactness: {
        view: BiodiversityIntactnessLayer
      },
      biodiversity_completeness: {
        view: BiodiversityCompletenessLayer
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
      cri_land_rights: {
        view: CriLandRightsLayer
      },
      nzl_land_rights: {
        view: NzlLandRightsLayer
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
      grump2000: {
        view: GrumpLayer
      },
      mangrove_2: {
        view: Mangrove2Layer,
        timelineView: MangroveTimeline
      },
      mangrove_watch: {
        view: MangroveWatchLayer
      },
      WMSLayer: {
        view: WMSLayer
      },
      concesiones_forestales: {
        view: ConcesionesForestalesLayer
      },
      concesiones_forestalesNS: {
        view: ConcesionesForestalesNotSupervisedLayer
      },
      terrailoss: {
        view: TerraiCanvasLayer,
        timelineView: TerraiTimeline
      },
      terraicanvas_cover: {
        view: TerraiCoverageLayer
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
      mexican_pa: {
        view: MexicanProtectedAreasLayer
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
      oil_palm_mills: {
        view: PalmOilMillsLayer
      },
      usa_conservation_easements: {
        view: UsaConservationEasementsLayer
      },
      us_land_cover: {
        view: UsaLandCoverLayer
      },
      us_land_cover_change: {
        view: UsaLandCoverChangeLayer
      },
      global_land_cover: {
        view: GlobalLandCoverLayer
      },
      bra_biomes: {
        view: BraBiomesLayer
      },
      idn_leuser: {
        view: IdnLeuserLayer
      },
      prodes: {
        view: ProdesLayer,
        timelineView: ProdesTimeline
      },
      prodes_coverage: {
        view: ProdesCoverLayer
      },
      per_prod_for: {
        view: PerPermForestLayer
      },
      raisg: {
        view: RaisgLayer
      },
      raisg_mining: {
        view: RaisgMiningLayer
      },
      plantations_by_type: {
        view: PlantationsLayerByType
      },
      plantations_by_species: {
        view: PlantationsLayerBySpecies
      },
      map_biomas: {
        view: BraMapBiomasLayer
      },
      bra_plantations_type: {
        view: BraPlantationsLayerByType
      },
      bra_plantations_species: {
        view: BraPlantationsLayerBySpecies
      },
      per_plantations_type: {
        view: PerPlantationsLayerByType
      },
      per_plantations_species: {
        view: PerPlantationsLayerBySpecies
      },
      lbr_plantations_type: {
        view: LbrPlantationsLayerByType
      },
      lbr_plantations_species: {
        view: LbrPlantationsLayerBySpecies
      },
      col_plantations_type: {
        view: ColPlantationsLayerByType
      },
      col_plantations_species: {
        view: ColPlantationsLayerBySpecies
      },
      khm_plantations_type: {
        view: KhmPlantationsLayerByType
      },
      khm_plantations_species: {
        view: KhmPlantationsLayerBySpecies
      },
      idn_plantations_type: {
        view: IdnPlantationsLayerByType
      },
      idn_plantations_species: {
        view: IdnPlantationsLayerBySpecies
      },
      mys_plantations_type: {
        view: MysPlantationsLayerByType
      },
      mys_plantations_species: {
        view: MysPlantationsLayerBySpecies
      },
      per_buffer: {
        view: PerBufferLayer
      },
      per_nat_pa: {
        view: PerNatPALayer
      },
      per_priv_pa: {
        view: PerPrivPALayer
      },
      per_reg_pa: {
        view: PerRegPALayer
      },
      idn_for_mor: {
        view: IdnForMorLayer
      },
      gtm_forest_change1: {
        view: GtmForestChange1Layer
      },
      gtm_forest_change2: {
        view: GtmForestChange2Layer
      },
      gtm_forest_cover: {
        view: GtmForestCoverLayer
      },
      gtm_forest_density: {
        view: GtmForestDensityLayer
      },
      umd_as_it_happens: {
        view: GladLayer,
        timelineView: GladTimeline
      },
      gfw_landsat_alerts_coverage: {
        view: LandsatAlertsCoverLayer
      },
      glad_coverage: {
        view: GladCoverageLayer
      },
      khm_pa: {
        view: KhmProtectedAreasLayer
      },
      khm_eco_land_conc: {
        view: KhmEcoLandLayer
      },
      usa_forest_ownership: {
        view: UsaForestOwnershipLayer
      },
      sentinel_tiles: {
        view: RecentImageryLayer
      },
      guyra: {
        view: GuyraLayer,
        timelineView: GuyraTimeline
      },
      logging_roads: {
        view: LoggingRoadsLayer
      },
      logging_roads_coverage: {
        view: LoggingRoadsCoverLayer
      },
      rus_hcv: {
        view: RusHcvLayer
      },
      cod_primary_forest_wgs: {
        view: DrcPrimaryForestLayer
      },
      guyra_coverage: {
        view: GuyraCoverLayer
      },
      mys_protected_areas: {
        view: MysPALayer
      },
      mys_peat_lands: {
        view: MysPeatLandsLayer
      },
      idn_peat_lands: {
        view: IdnPeatLandsLayer
      },
      mex_mining: {
        view: MexMiningLayer
      },
      per_mining: {
        view: PerMiningLayer
      },
      bra_mining: {
        view: BraMiningLayer
      },
      bra_soy: {
        view: BraSoyCerradoLayer
      },
      bra_rtrs: {
        view: BraRTRSLayer
      },
      pry_rtrs: {
        view: PryRTRSLayer
      },
      per_minam_tree_cover: {
        view: PerMinamCoverLayer
      },
      can_ifl: {
        view: CanIntactForestLayer
      },
      mex_forest_zoning_cat: {
        view: MexForestCatLayer
      },
      mex_forest_zoning_subcat: {
        view: MexForestSubCatLayer
      },
      mex_forest_zoning_conserv: {
        view: MexForestConservLayer
      },
      mex_forest_zoning_prod: {
        view: MexForestProdLayer
      },
      mex_forest_zoning_rest: {
        view: MexForestRestLayer
      },
      places_to_watch: {
        view: Places2WatchLayer
      },
      uncurated_places_to_watch: {
        view: UncuratedPlaces2WatchLayer
      },
      mexican_psa: {
        view: MexicoPaymentsLayer
      },
      mex_land_rights: {
        view: MexLandRightsLayer
      },
      bra_logging: {
        view: BraLoggingLayer
      },
      mys_wood_fiber_sabah: {
        view: MysWoodFiberSabahLayer
      },
      mys_proteced_areas_sabah: {
        view: MysPASabahLayer
      },
      mys_logging_sabah: {
        view: MysLoggingSabahLayer
      },
      per_protected_areas: {
        view: PerPALayer
      },
      mex_land_cover: {
        view: MexLandCoverLayer
      },
      uga_protected_areas: {
        view: UgaPALayer
      },
      can_protected_areas: {
        view: CanProtectedAreasLayer
      },
      lbr_mineral_exploration_license: {
        view: LbrMinExL
      },
      lbr_mineral_development_agreement: {
        view: LbrMinDevAg
      },
      lbr_development_exploration_license: {
        view: LbrDevExL
      },
      pak_user_mangroves: {
        view: PakUserMangrovesLayer
      },
      sen_user_protected_areas: {
        view: SenUserProtectedAreasLayer
      },
      hti_user_watersheds: {
        view: HaitiWatershedLayer
      },
      ecu_user_protected_areas: {
        view: EcuUserProtectedAreasLayer
      },
      bol_user_fire_frequency: {
        view: BolUserFireFrequencyLayer
      },
      nothing: {}
    };

    return layersHelper;
  }
);
