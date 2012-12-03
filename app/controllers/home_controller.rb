class HomeController < ApplicationController
  def index
    #@area = Area.new
    @featured = Story.where(:featured => true).order('cartodb_id ASC')
  end
end
