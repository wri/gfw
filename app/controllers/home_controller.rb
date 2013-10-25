class HomeController < ApplicationController

  def index
    @featured = Story.first_three_featured

    @alerts_count = Alert.ammount_in_the_last_year
  end

  def register
    @email = params['email']

    @user = User.new(email: @email)
    @user.save

    Notifications.new_user(@email).deliver

    head 200

  end

end
