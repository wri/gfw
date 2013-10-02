class Notifications < ActionMailer::Base
  default from: "gfw@wri.org"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.new_story.subject
  #
  def new_story(story)
    @story = story

    mail to: "janderson@wri.org, gfw@wri.org, sminnemeyer@wri.org, aleach@wri.org"
    #mail to: "dcano@vizzuality.com, ferdev@vizzuality.com"
  end

  def new_user(user_email)
    @reply_to_email = user_email

    mail to: "gfw@wri.org", reply_to: user_email, subject: 'A new user requested access to Global Forest Watch 2.0'
  end

end
