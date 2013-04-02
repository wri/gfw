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
    mail to: "gfw@wri.org", reply_to: user_email
  end

end
