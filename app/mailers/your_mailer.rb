class YourMailer < ActionMailer::Base
  def feedback(body, email)
    mail :subject => "GFW Feedback",
         :to      => ENV["FEEDBACK_MAIL"],
         :from    => email,
         :body    => body
  end
end
