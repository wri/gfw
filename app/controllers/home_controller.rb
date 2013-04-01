class HomeController < ApplicationController

  def index
    #@area = Area.new
    @featured = Story.where(:featured => true).order('cartodb_id DESC').per_page(3).all

    #require 'debugger'; debugger
    @alerts_count = Alert.ammount_in_the_last_year
  end

end
