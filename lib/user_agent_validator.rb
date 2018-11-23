class UserAgentValidator
  Browser = Struct.new(:browser, :version)

  SupportedBrowsers = [
    Browser.new('Safari', '10'),
    Browser.new('Firefox', '48'),
    Browser.new('Internet Explorer', '11'),
    Browser.new('Chrome', '50'),
    Browser.new('Opera', '51'),
    Browser.new('Edge', '15')
  ]

  def self.user_agent_supported? user_agent
    instance = self.new user_agent
    instance.user_agent_supported?
  end

  def initialize user_agent
    @user_agent = user_agent
  end

  def user_agent_supported?
    is_supported_browser || user_agent.bot?
  end

  def method_missing method
     user_agent.send(method) rescue super(method)
  end

  private

  def is_supported_browser
    SupportedBrowsers.detect { |browser| user_agent >= browser }
  end

  def user_agent
    UserAgent.parse(@user_agent)
  end
end
