# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.globalforestwatch.org"
SitemapGenerator::Sitemap.compress = false

SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'daily', :priority => 1.0

  add '/map', :changefreq => 'weekly', :priority => 0.8
  add '/countries', :changefreq => 'weekly', :priority => 0.8
  add '/country/', :changefreq => 'weekly', :priority => 0.8
  add '/about', :changefreq => 'weekly', :priority => 0.8
  add '/small-grants-fund', :changefreq => 'weekly', :priority => 0.8
  add '/search', :changefreq => 'weekly', :priority => 0.8
  add '/stories', :changefreq => 'weekly', :priority => 0.8

  add '/contribute-data', :changefreq => 'weekly', :priority => 0.4
  add '/sitemap', :changefreq => 'weekly', :priority => 0.4
  add '/terms', :changefreq => 'weekly', :priority => 0.4

  # external apps
  add '/howto', :changefreq => 'weekly', :priority => 0.4
  add 'https://developers.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'http://data.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4
  add 'http://blog.globalforestwatch.org', :changefreq => 'weekly', :priority => 0.4

end