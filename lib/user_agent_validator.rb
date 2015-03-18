class UserAgentValidator
  Browser = Struct.new(:browser, :version)

  SupportedBrowsers = [
    Browser.new('Safari', '5.0.5'),
    Browser.new('Firefox', '12.0'),
    Browser.new('Internet Explorer', '10.0'),
    Browser.new('Chrome', '19.0.1036.7'),
    Browser.new('Opera', '11.00')
  ]

  SupportedSnippetCollectors = [
    Regexp.new("facebookexternalhit"),
    Regexp.new("https://developers.google.com/\\+/web/snippet/")
  ]

  def self.user_agent_supported? user_agent
    instance = self.new user_agent
    instance.user_agent_supported?
  end

  def initialize user_agent
    @user_agent = user_agent
  end

  def user_agent_supported?
    is_supported_browser || user_agent.bot? || is_snippet_collector
  end

  private

  def is_snippet_collector
    @user_agent.match(Regexp.union(SupportedSnippetCollectors))
  end

  def is_supported_browser
    SupportedBrowsers.detect { |browser| user_agent >= browser }
  end

  def user_agent
    UserAgent.parse(@user_agent)
  end
end
