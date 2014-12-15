class YourMailer < ActionMailer::Base
  def feedback(body)
    puts params
    mail :subject => "GFW Feedback",
         :to      => "adrian@simbiotica.es",
         :from    => "adrian@simbiotica.es",
         :body    => body
    self.deliver
  end
end
