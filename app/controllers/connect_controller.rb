class ConnectController < ApplicationController
  layout 'connect'

  before_filter :check_terms

  def index
    redirect_to :user_login unless logged_in?

    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
  end

  def login
    redirect_to :user_index if logged_in?

    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @apiurl = ENV['GFW_API_HOST']
  end

  private

  def logged_in?
    !cookies[:_eauth].nil?
  end
end
