class HomeController < ApplicationController

  def index
    @featured = Story.first_three_featured

    @alerts_count = Alert.ammount_in_the_last_year
  end

  def register
    Notifications.new_user(params['email']).deliver
    head 200
  end

end
