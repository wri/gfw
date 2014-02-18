class MediaController < ApplicationController

  def upload
    uploader = MediaUploader.new
    uploader.store!(params[:media][:image])

    redirect_to media_show_path(url: uploader.url)
  end

  def show
    respond_to do |format|
      format.json { render :json => { url: params['url'] } }
      format.html { render :json => { url: params['url'] } }
    end
  end

end