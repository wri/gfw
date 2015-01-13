class YourMailer < ActionMailer::Base
  def feedback(body, email)
    mail :subject => "GFW Feedback",
         :to      => ENV["FEEDBACK_MAIL"],
         :from    => email,
         :template_path => 'your_mailer',
         :template_name => 'feedback'
  end
end
