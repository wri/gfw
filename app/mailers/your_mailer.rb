class YourMailer < ActionMailer::Base
  def feedback(body, email)
    mail :subject => "GFW Feedback",
         :to      => "abarrett@wri.org",
         :from    => email,
         :body    => body
  end
end
