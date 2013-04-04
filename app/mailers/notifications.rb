class Notifications < ActionMailer::Base
  default from: "admin@gfw.org"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.new_story.subject
  #
  def new_story(story)
    @story = story

    mail to: "dcano@vizzuality.com, sminnemeyer@wri.org, aleach@wri.org"
    #mail to: "dcano@vizzuality.com, ferdev@vizzuality.com"
  end

  def new_user(user_email)
    @user_email = user_email

    mail to: "dcano@vizzuality.com", reply_to: user_email, subject: 'A new user requested access to Global Forest Watch 2.0'
  end

end
