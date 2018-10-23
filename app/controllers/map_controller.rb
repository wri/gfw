class MapController < ApplicationController

  before_action :validate_url, :only => [:index, :embed]

  def index
    render layout: 'application'
    @title = 'Interactive Map'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @currentNavigation = '.shape-map'
  end

  def embed
    render layout: 'application_embed'
    @title = 'Interactive Map'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
  end

  private

  def validate_url
    if (params[:basemap].present? && params[:baselayer].present?)
      baselayers = ['loss', 'forma', 'imazon', 'none']
      basemaps = ['grayscale', 'terrain', 'satellite', 'roads', 'treeheight']

      for i in 1999..2012
        basemaps.push('landsat'+i.to_s)
      end

      redirect_to map_path unless basemaps.include?(params[:basemap]) && baselayers.include?(params[:baselayer])
    end
  end

end
