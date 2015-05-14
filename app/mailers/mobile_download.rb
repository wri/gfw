class MobileDownload < ActionMailer::Base
  default from: "gfw@wri.org"

  # Set subject in I18n: en.mobile_download.download_email.subject
  def download_email email_address, download_link, type
    @download_link = download_link
    @type = type
    subject = (@type.present?) ? 'Link to download tree cover statistics' : 'Link to browse and download country data'
    mail to: email_address, subject: subject
  end
end
