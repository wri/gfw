class MobileDownload < ActionMailer::Base
  default from: "gfw@wri.org"

  # Set subject in I18n: en.mobile_download.download_email.subject
  def download_email email_address, download_link, type
    @download_link = download_link
    @type = type

    case @type
      when "default"
        subject = 'Link to browse and download country data'
        @body = 'Click the link below to browse and download data for your country of interest on the Open Data Portal.'
      when "country-stats"
        subject = 'Link to download tree cover statistics'
        @body = 'Click the link below to download tree cover statistics for your country of interest.'
      when "forest-change"
        subject = 'Link to download data'
        @body = 'Click the link below to download data from your recent analysis on GFW.'
      else
        subject = 'Link to browse and download country data'
        @body = 'Click the link below to browse and download data for your country of interest on the Open Data Portal.'
    end

    mail :subject => subject,
         :to      => email_address,
         :from    => 'gfw@wri.org'
  end
end
