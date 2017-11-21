class DownloadController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create_download]

  def create_download
    if (params[:email].present?)
      MobileDownload.download_email(
        params[:email],
        params[:link],
        params[:type],
      ).deliver_now

      return render json: true
    end

    return render json: false, status: :unprocessable_entity
  end
end
