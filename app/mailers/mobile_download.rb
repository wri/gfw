class MobileDownload < ActionMailer::Base
  default from: "gfw@wri.org"

  # Set subject in I18n: en.mobile_download.download_email.subject
  def download_email email_address, download_link, type
    @download_link = download_link
    @type = type
    subject = (type == 'default') ? 'Link to browse and download country data' : 'Link to download tree cover statistics'
    puts subject
    mail :subject => subject,
         :to      => email_address,
         :from    => 'gfw@wri.org'
  end
end
