class HomeController < ApplicationController

  def index
    #@area = Area.new
    @featured = Story.where(:featured => true).order('cartodb_id ASC')

    @alerts_count = Alert.ammount_in_the_last_six_months
  end

end
