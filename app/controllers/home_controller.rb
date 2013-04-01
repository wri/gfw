class HomeController < ApplicationController

  def index
    #@area = Area.new
    @featured = Story.where(:featured => true).order('cartodb_id DESC').first(3)

    #require 'debugger'; debugger
    @alerts_count = Alert.ammount_in_the_last_year
  end

end
