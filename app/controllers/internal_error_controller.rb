class InternalErrorController < ApplicationController
  def index
    render :status => 500
  end

end
