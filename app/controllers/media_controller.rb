class MediaController < ApplicationController
  def upload
    uploader = MediaUploader.new
    uploader.store!(params[:media][:image])

    render nothing: true
  end
end