class AreasController < ApplicationController

  def create
    area = Area.new params[:area]
    area.save

    respond_to do |format|
      format.js {   render( :json => ["OK"] ) }
    end
  end

end
