class MobileDownload < ActionMailer::Base
  default from: "gfw@wri.org"

  # Set subject in I18n: en.mobile_download.download_email.subject
  def download_email email_address, download_link, type
    @download_link = download_link
    @type = type
    mail to: email_address
  end
end
