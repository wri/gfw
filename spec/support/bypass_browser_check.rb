module BypassBrowserCheck
  def bypass_browser_check
    controller.request.user_agent = "bot" # get past browser checks
  end
end
