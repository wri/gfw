class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception

  before_action :check_browser, if: proc { Rails.env.production? }
  before_action :check_production
  before_action :cache_keys, if: proc { Rails.env.production? }
  before_action :set_metadata

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def cache_keys
    @cache_keys = $redis.keys('*')
  end

  def check_production
    @is_production = Rails.env.production?
  end

  def set_metadata
    @metadata = {
      about: {
        title: 'About',
        desc: 'Global Forest Watch (GFW) is an online platform that provides data and tools for monitoring forests. By harnessing cutting-edge technology, GFW allows anyone to access near real-time information about where and how forests are changing around the world.',
        keywords: 'GFW, about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw commodities, about gfw fires'
      },
      map_v2: {
        title: 'Interactive Map',
        description: 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.',
        keywords: 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
      },
      small_grants_fund: {
        title: 'Small Grants Fund'
      },
      dashboards: {
        title: 'Dashboards',
        desc: 'Data about forest change, tenure, forest related employment and land use'
      },
      types: {
        draw: 'Custom Area Analysis',
        wdpa: 'Protected Area'
      }
    }

    if @metadata[controller_name.to_sym]
      @title = @metadata[controller_name.to_sym][:title]
      @desc = @metadata[controller_name.to_sym][:desc]
      @keywords = @metadata[controller_name.to_sym][:keywords]
    end
  end

  private

  def check_browser
    unless UserAgentValidator.user_agent_supported? request.user_agent
      redirect_to "/notsupportedbrowser"
    end
  end

  def check_location
    if !params[:iso] && params[:type] && params[:type] != 'global'
      redirect_to action: "index"
    elsif params[:iso]
      if params[:sub_region]
        @location = Application.find_adm2_by_iso_id(params[:iso], params[:region], params[:sub_region])
      elsif params[:region]
        @location = Application.find_adm1_by_iso_id(params[:iso], params[:region])
      else
        @location = Application.find_country_by_iso(params[:iso])
      end
    end
    set_title
  end

  def set_title
    @typeKey = params[:type] ? @metadata[:types][params[:type].to_sym] : nil
    if !@location
      @location_title = params[:type] ? (@typeKey || params[:type].capitalize) : nil
    else
      if params[:sub_region]
        @location_title = "#{@location['adm2']}, #{@location['adm1']}, #{@location['name']}"
      elsif params[:region]
        @location_title = "#{@location['adm1']}, #{@location['name']}"
      elsif params[:iso]
        @location_title = "#{@location['name']}"
      else
        @location_title = params[:type] ? (@typeKey || params[:type].capitalize) : nil
      end
    end
  end

end
