class YourMailer < ActionMailer::Base
  def feedback(body)
    mail :subject => "GFW Feedback",
         :to      => "adrian@simbiotica.es",
         :from    => "adrian@simbiotica.es",
         :body    => body
  end
end
