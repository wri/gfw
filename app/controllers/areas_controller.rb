class AreasController < ApplicationController

  def create
    area = Area.new params[:area]
    area.save

    respond_to do |format|
      format.json { render :nothing => true }
    end
  end

end
