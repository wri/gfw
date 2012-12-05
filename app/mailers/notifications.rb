class Notifications < ActionMailer::Base
  default from: "admin@gfw.org"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.new_story.subject
  #
  def new_story(story)
    @story = story

    mail to: "ferdev@vizzuality.com"
  end
end
