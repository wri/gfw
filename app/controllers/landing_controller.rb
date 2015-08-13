class LandingController < ApplicationController
  layout 'landing'

  def index
    require 'rss'
    @title = 'Monitoring forests in near real time'
    @desc = 'Empowering people everywhere to better manage and conserve forest landscapes through an interactive online forest monitoring system.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
    @feedview    = []
    @storiesview = []
    fview     = RSS::Parser.parse('https://gfw-huggin.herokuapp.com/users/1/web_requests/14/feedviewrss.xml')
    fview.items.each do |i|
      @feedview.push({
        'title' => i.title,
        'link' => i.link,
        'date' => i.pubDate,
        'description' => i.description
      })
      break if @feedview.length > 4
    end
    fstories  = RSS::Parser.parse('https://gfw-huggin.herokuapp.com/users/1/web_requests/15/keepupdatedgfwrss.xml')
    fstories.items.each do |i|
      @storiesview.push({
        'title' => i.title,
        'link' => i.link,
        'date' => i.pubDate,
        'description' => i.description
      })
      break if @storiesview.length > 2
    end
  end

end
