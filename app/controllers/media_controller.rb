class MediaController < ApplicationController
  def upload
    uploader = MediaUploader.new
    uploader.store!(params[:media][:image])

    redirect_to media_show_path(url: uploader.url)
  end

  def show
    url = params['url']
    basename = File.basename(url)

    render :json => { url: url, basename: basename }
  end
end
