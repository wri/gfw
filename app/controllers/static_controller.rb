class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support
  respond_to :html
  respond_to :json, :only => :keepstories

  LEGACY_SOURCES = YAML.load_file(
    Rails.root.join('config', 'legacy_sources.yml'))

  def terms
    @title = 'Terms of Service'
    @desc = 'Welcome to the WRI family of environmental data platforms. By using the Services, you agree to be bound by these Terms of Service and any future updates.'
    @keywords = 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher'
  end

  def privacy
    @title = 'Privacy Policy'
    @desc = 'This Privacy Policy tells you how WRI handles information collected about you through our websites and applications.'
    @keywords = 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher'
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
    @title = "Browser Not Supported"
    @desc = "Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again."
  end
end
