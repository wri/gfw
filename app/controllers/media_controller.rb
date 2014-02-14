class MediaController < ApplicationController
  def upload
    uploader = MediaUploader.new
    uploader.store!(params[:media][:image])

    @media = uploader.url

    puts "*********** #{@media} ***********"

    render :nothing => true
  end
end
