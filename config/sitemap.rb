# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.globalforestwatch.org"
SitemapGenerator::Sitemap.compress = false

SitemapGenerator::Sitemap.create do
  add '/map', :changefreq => 'weekly', :priority => 0.8
  add '/dashboards/global', :changefreq => 'weekly', :priority => 0.8

  Gadm36.find_all_countries.each do |country|
    add "/map/country/#{country['iso']}", :changefreq => 'weekly', :priority => 0.6
  end

  Gadm36.find_all_countries.each do |country|
    add "/dashboards/country/#{country['iso']}", :changefreq => 'weekly', :priority => 0.6
  end

  add '/about', :changefreq => 'weekly', :priority => 0.8
  add '/small-grants-fund', :changefreq => 'weekly', :priority => 0.8
  add '/search', :changefreq => 'weekly', :priority => 0.8
  add '/stories', :changefreq => 'weekly', :priority => 0.8

  add '/sitemap', :changefreq => 'weekly', :priority => 0.4
  add '/terms', :changefreq => 'weekly', :priority => 0.4
  add '/privacy-policy', :changefreq => 'weekly', :priority => 0.4

  # external apps
  add '/howto', :changefreq => 'weekly', :priority => 0.4
  add 'https://developers.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'http://data.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'http://blog.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4

end
