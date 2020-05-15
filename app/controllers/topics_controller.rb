class TopicsController < ApplicationController
  def index
    @title = "#{params[:type].capitalize()} | Topics"
  end
end
