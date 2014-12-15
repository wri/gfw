class YourMailer < ActionMailer::Base
  def email_name
    mail :subject => "Mandrill rides the Rails!",
         :to      => "recipient@example.com",
         :from    => "you@yourdomain.com"
  end
end