# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.globalforestwatch.org"
SitemapGenerator::Sitemap.compress = false

SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'weekly', :priority => 1

  add '/map', :changefreq => 'weekly', :priority => 0.8
  Gadm36.find_all_countries.each do |country|
    add "/map/country/#{country['iso']}", :changefreq => 'weekly', :priority => 0.6
  end

  add '/dashboards/global', :changefreq => 'weekly', :priority => 0.8
  Gadm36.find_all_countries.each do |country|
    add "/dashboards/country/#{country['iso']}", :changefreq => 'weekly', :priority => 0.6
  end

  add '/topics/biodiversity', :changefreq => 'weekly', :priority => 0.8
  add '/topics/climate', :changefreq => 'weekly', :priority => 0.8
  add '/topics/commodities', :changefreq => 'weekly', :priority => 0.8
  add '/topics/water', :changefreq => 'weekly', :priority => 0.8

  add '/my-gfw', :changefreq => 'weekly', :priority => 0.8
  add '/about', :changefreq => 'weekly', :priority => 0.8
  add '/grants-and-fellowships', :changefreq => 'weekly', :priority => 0.8

  add '/search', :changefreq => 'weekly', :priority => 0.8
  add '/terms', :changefreq => 'weekly', :priority => 0.4
  add '/privacy-policy', :changefreq => 'weekly', :priority => 0.4

  # external apps
  add '/howto', :changefreq => 'weekly', :priority => 0.4
  add 'https://developers.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'https://data.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'https://blog.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4

end
