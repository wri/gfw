class MediaController < ApplicationController

  def create
    image_uploader = ImageUploader.new
    image_uploader.store!(params[:media][:image])
    @media = Media.create(:image => image_uploader.identifier)

    redirect_to @media
  end

  def show
    @media = Media.where(:cartodb_id => params[:id])
    respond_to do |format|
      format.json { render :json => @media }
      format.html { render :json => @media }
    end
  end

end
