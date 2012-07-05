class AreasController < ApplicationController

  def create
    logger.info "*****"
    logger.info params[:area]
    logger.info "*****"
    area = Area.new params[:area]
    area.save

    respond_to do |format|
      format.json { render :nothing => true }
    end
  end

end
