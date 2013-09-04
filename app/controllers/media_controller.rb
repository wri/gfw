class MediaController < ApplicationController
  before_filter :get_media, :only => [:show, :destroy]

  def create
    image_uploader = ImageUploader.new
    image_uploader.store!(params[:media][:image])
    @media = Media.create(:image_url => image_uploader.url,
                          :big_url => image_uploader.big.url,
                          :thumbnail_url => image_uploader.thumb.url)

    redirect_to @media
  end

  def show
    respond_to do |format|
      format.json { render :json => @media }
      format.html { render :json => @media }
    end
  end

  def destroy
    @media.destroy

    render :nothing => true
  end

  def get_media
    @media = Media.where(:cartodb_id => params[:id])
  end

end
