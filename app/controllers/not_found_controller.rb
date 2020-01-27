class NotFoundController < ApplicationController

  def index
    render :status => 404
  end

end
