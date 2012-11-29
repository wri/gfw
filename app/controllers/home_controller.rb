class HomeController < ApplicationController
  def index
    #@area = Area.new
    @featured = Story.where(:featured => true)
  end
end
