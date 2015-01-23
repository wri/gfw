class YourMailer < ActionMailer::Base
  def feedback(feedback,signup,email)
    @feedback = feedback.present? ? feedback : nil
    @email = email.present? ? email : nil
    @signup = signup

    mail :subject => "GFW Feedback",
         :to      => ENV["FEEDBACK_MAIL"],
         :from    => 'feedback@wri.com',
         :template_path => 'your_mailer',
         :template_name => 'feedback'
  end
end
