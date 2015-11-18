class ConnectController < ApplicationController
  layout 'connect'

  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  before_filter :check_terms

  def index
    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @user = user
  end

  def login
    check_cookie
    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
    @apiurl = ENV['GFW_API_HOST']
  end

  private
    def user
      begin
        if !cookies[:_eauth]
            redirect_to '/my_gfw-login'
        end
        response = Typhoeus.get("#{ENV['GFW_API_HOST']}/user/session",
            headers: {"Accept" => "application/json","cookie"=>"_eauth="+cookies[:_eauth]}
        )
        if response.success?
          if response.body.length > 0
            JSON.parse(response.body)
          else
            redirect_to '/my_gfw-login'
          end
        else 
          puts 'something went wrong, retrying...'
          sleep(30)
          user
        end
      rescue Exception => e
        Rails.logger.error "Error retrieving twitter status: #{e}"
      end
    end

    def check_cookie
      if cookies[:_eauth].nil?
        nil
      else
        redirect_to '/my_gfw'
      end
    end
end
