class LandingController < ApplicationController
  layout 'landing'

  def index
    require 'open-uri'
    @title = 'Monitoring forests in near real time'
    @desc = 'Empowering people everywhere to better manage and conserve forest landscapes through an interactive online forest monitoring system.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
    @feedview    = []
    @storiesview = []
    fview     = Nokogiri::HTML(open('https://gfw-huggin.herokuapp.com/users/1/web_requests/14/feedviewrss.xml'))
    fview.css('item').each do |i|
      @feedview.push({
        'title' => i.css('title').text,
        'link' => i.css('link').text,
        'date' => i.css('pubDate').text,
        'description' => i.css('description').text
      })
      break if @feedview.length > 5
    end
    fstories  = Nokogiri::HTML(open('https://gfw-huggin.herokuapp.com/users/1/web_requests/15/keepupdatedgfwrss.xml'))
    fstories.css('item').each do |i|
      @storiesview.push({
        'title' => i.css('title').text,
        'link' => i.css('link').text,
        'date' => i.css('pubDate').text,
        'description' => i.css('description').text,
        'avatar' => '',
        'id' => i.css('gfwid')
      })
      break if @storiesview.length > 2
    end
  end

end
