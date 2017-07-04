class DataController < ApplicationController
  skip_before_action :verify_authenticity_token

  def upload
    uploader = DataUploader.new
    uploader.store!(params[:data_upload])

    redirect_to data_show_path(url: uploader.url)
  end

  def show
    url = params['url']
    basename = File.basename(url)

    render :json => { url: url, basename: basename }
  end
end
