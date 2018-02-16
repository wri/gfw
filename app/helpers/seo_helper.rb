module SeoHelper
  TITLE = 'Global Forest Watch'.freeze

  SEO = [
    {path: '/',
     subtitle: 'Global Forest Watch',
     description: 'Data about forest change, tenure, forest related employment and land use'},
    {path: '/country',
     subtitle: 'Country profiles',
     description: 'Data about forest change, tenure, forest related employment and land use'}
  ].freeze

  IMAGES_PATHS = {
    '/' => '/assets/backgrounds/home-slider/bg_slide1.png',
    '/country' => '/assets/country.png'
  }.freeze

  def split_country_name(path)
    path[9, 3]
  end

  def country_description(path)
    @country_name = split_country_name(path)
    "Data about forest change, tenure, forest related employment and land use in #{country_name}"
  end

  def country_title(path)
    @country_name = split_country_name(path)
    "#{@country_name} | #{TITLE}"
  end

  def image_src(path)
    if IMAGES_PATHS[path]
      asset_url(IMAGES_PATHS[path])
    else
      asset_url('/images/social-home.png')
    end
  end

  def title_content(subtitle)
    subtitle ? "#{TITLE} - #{subtitle}" : TITLE
  end

  def description(path)
    SEO.each do |page|
      return page[:description] if page[:path] == path
      return country_description(path) if path.include? '/country'
      return SEO[0][:description]
    end
  end

  def title(path)
    SEO.each do |page|
      return title_content(page[:subtitle]) if page[:path] == path
      return country_title(path) if path.include? '/country'
      return title_content(nil)
    end
  end
end
