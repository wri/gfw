class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support
  respond_to :html
  respond_to :json, :only => :keepstories

  LEGACY_SOURCES = YAML.load_file(
    Rails.root.join('config', 'legacy_sources.yml'))

  def terms
    @title = 'Terms of Service'
  end

  def privacy
    @title = 'Privacy Policy'
  end

  # TODO: no route?
  def data
    section = params[:section]
    source  = params[:t]
    section = LEGACY_SOURCES[section]
    data_id = section[source] unless section.nil?

    case source
    when 'protected_areas'
      url = 'http://www.protectedplanet.net/'
    when 'palm-oil-mills'
      url = 'http://data.gfw.opendata.arcgis.com/datasets/20398d4dc36e47bd92b559786670f270_0'
    when 'fires'
      url = 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms'
    end

    if data_id.nil?
      url = 'http://data.globalforestwatch.org/'
    else
      url = "http://data.globalforestwatch.org/datasets/#{data_id}"
    end

    redirect_to url
  end

  # TODO: no route?
  def keep
    @title = 'Stay informed'
    @desc = 'Read the latest news and GFW analysis, sign up to receive alerts, and subscribe to areas of interest.'
    @keywords = 'GFW, stay informed, stories, read, news, blog, newsletter, sign up, publications, browse, updates, keep udated, submit, upload, share'
    @currentNavigation = '.shape-keep'

    @page        = (params[:page] || 1).to_i
  end

  # TODO: no route?
  def keepstories
    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @total_stories = Api::Story.visible.count
    @stories_per_page = stories_per_page
    @visible     = Api::Story.find_by_page(@page, stories_per_page)

    respond_with @visible
  end

  def browser_support
    @title = "Oops, your browser isn't supported."
  end
end
