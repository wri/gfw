class ConnectController < ApplicationController
  layout 'connect'

  before_filter :check_terms

  def index
    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @user = user
    @loggedin = !!cookies[:_eauth]
  end

  def login
    redirect_to '/my_gfw' unless cookies[:_eauth].nil?

    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @apiurl = ENV['GFW_API_HOST']
    @loggedin = !!cookies[:_eauth]
  end

  private

  def user
    if !cookies[:_eauth]
      return redirect_to '/my_gfw-login'
    end

    response = Typhoeus.get("#{ENV['GFW_API_HOST']}/user/session",
      headers: {
        "Accept" => "application/json",
        "cookie" => "_eauth="+cookies[:_eauth]
      })

    if response.success? && response.body.length > 0
      JSON.parse(response.body)
    else
      redirect_to '/my_gfw-login'
    end
  end
end
