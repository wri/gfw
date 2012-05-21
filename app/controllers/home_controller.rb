class HomeController < ApplicationController
  def index
    @area = Area.new
  end
end
