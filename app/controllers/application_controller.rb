class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception

  before_action :check_browser, if: proc { Rails.env.production? }
  before_action :check_production
  before_action :cache_keys, if: proc { Rails.env.production? }
  before_action :set_metadata

  def cache_keys
    @cache_keys = $redis.keys('*')
  end

  def check_production
    @is_production = Rails.env.production? || Rails.env.production_local?
  end

  def set_metadata
    @metadata = {
      home: {
        title: 'Forest Monitoring Designed for Action',
        desc: 'Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests.',
        keywords: 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
      },
      about: {
        title: 'About GFW',
        desc: 'Global Forest Watch is an online platform that provides data and tools for monitoring forests.',
        keywords: 'GFW, about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw pro, about gfw fires, about forest watcher, forests'
      },
      map: {
        title: 'Interactive Map',
        description: 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.',
        keywords: 'GFW, map, forests, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
      },
      grants_and_fellowships: {
        title: 'Grants & Fellowships',
        desc: 'The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work.',
        keywords: 'forests, forest data, data, technology, forest monitoring, forest policy, advocacy, education, fellow, fellowship, grants, civil society, land rights, conservation, field work, local, deforestation, community, research'
      },
      dashboards: {
        title: 'Dashboards',
        desc: 'Analyze and investigate global data trends in forest change, cover and use with just a few clicks.',
        keywords: 'GFW, forests, dashboard, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, investigate, tree, cover, loss, country, deforestation, land use, forest change.'
      },
      topics: {
        title: 'Topics',
        desc: 'Explore the relationship between forests and several key themes critical to sustainability and the health of our future ecosystems.',
        keywords: 'biodiversity, commodities, water, climate, forests, sustainability, ecosystems, health, deforestation, conservation, forest loss'
      },
      thankyou: {
        title: 'Thank You'
      },
      use: {
        title: 'Area of Interest',
        desc: 'Explore the status of forests within your area of interest by layering data to create custom maps of forest change, cover and use.'
      },
      geostore: {
        title: 'Custom Area',
        desc: 'Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use.'
      },
      wdpa: {
        title: 'Protected Area',
        desc: 'Explore the status of forests in protected areas by layering data to create custom maps of forest change, cover and use.'
      },
      global: {
        title: 'Global',
        desc: 'Analyze and investigate global data trends in forest change, cover and use with just a few clicks.'
      },
      country: {
        title: '',
        desc: 'Analyze and investigate data trends in forest change, cover and use with just a few clicks.'
      },
      aoi: {
        title: 'Area of Interest',
        desc: ''
      },
      terms: {
        title: 'Terms of Service',
        desc: 'Welcome to the WRI family of environmental data platforms. By using the Services, you agree to be bound by these Terms of Service and any future updates.',
        keywords: 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher',
      },
      privacy: {
        title: 'Privacy Policy',
        desc: 'This Privacy Policy tells you how WRI handles information collected about you through our websites and applications.',
        keywords: 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher'
      },
      stories: {
        title: "Stories",
        desc: "Due to limited use, the user stories feature is no longer available on GFW."
      },
      browser_support: {
        title: "Browser Not Supported",
        desc: "Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again."
      },
      not_found: {
        title: 'Page Not Found',
        desc: 'You may have mistyped the address or the page may have moved.'
      },
      unacceptable: {
        title: "The change you wanted was rejected",
        desc: "Maybe you tried to change something you didn't have access to."
      },
      internal_error: {
        title: "We're sorry, something went wrong.",
        desc: "Maybe you tried to change something you didn't have access to."
      },
      search: {
        title: 'Search',
        desc: 'Search forest information, including forest data, news, updates and more.',
        keywords: 'GFW, forests, forest data, data, forest news, forest alerts, conservation, forest updates, forest watch, deforestation, deforesting, tree cover loss, forest loss'
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
      redirect_to "/browser-support"
    end
  end

  def check_location
    if !params[:adm0] && params[:type] && params[:type] != 'global'
      redirect_to action: "index"
    elsif params[:adm0]
      if params[:adm2]
        @location = Gadm36.find_adm2_by_adm0_id(params[:adm0], params[:adm1], params[:adm2])
      elsif params[:adm1]
        @location = Gadm36.find_adm1_by_adm0_id(params[:adm0], params[:adm1])
      else
        @location = Gadm36.find_adm0_by_adm0_id(params[:adm0])
      end
    end
    set_title
  end

  def set_title
    @meta = params[:type] ? @metadata[params[:type].to_sym] : nil;
    @desc = params[:type] ? @meta[:desc] : nil
    if !@location
      @location_title = params[:type] ? (@meta[:title] || params[:type].capitalize) : nil
      @desc = params[:type] ? @meta[:desc] : nil
    else
      if params[:adm2]
        @location_title = "#{@location['adm2']}, #{@location['adm1']}, #{@location['name']}"
      elsif params[:adm1]
        @location_title = "#{@location['adm1']}, #{@location['name']}"
      elsif params[:adm0]
        @location_title = "#{@location['name']}"
      else
        @location_title = params[:type] ? (@meta[:title] || params[:type].capitalize) : nil
      end
    end
  end

end
