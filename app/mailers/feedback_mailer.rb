class FeedbackMailer < ActionMailer::Base
  def feedback(feedback,signup,email,hostname)
    @feedback = feedback.present? ? feedback : nil
    @email = email.present? ? email : nil
    @signup = signup
    @hostname = hostname.present? ? hostname : nil

    emails = get_mails(@hostname)

    mail :subject => "GFW Feedback",
         :to      => emails,
         :from    => 'feedback@globalforestwatch.org',
         :template_path => 'your_mailer',
         :template_name => 'feedback'
  end

  private
    def get_mails(hostname)
      case hostname
        when 'fires.globalforestwatch.org' then ['SMinnemeyer@wri.org', 'gfw@wri.org']
        when 'commodities.globalforestwatch.org' then ['slake@wri.org', 'gfw@wri.org']
        when 'climate.globalforestwatch.org' then ['cciciarelli@wri.org', 'gfw@wri.org']
        else ['abarrett@wri.org', 'gfw@wri.org']
      end
    end
end
