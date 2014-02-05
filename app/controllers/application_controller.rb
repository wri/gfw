class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_filter :check_browser
  before_filter :check_terms

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

    Browser = Struct.new(:browser, :version)

    SupportedBrowsers = [
      Browser.new('Safari', '5.0.5'),
      Browser.new('Firefox', '12.0'),
      Browser.new('Internet Explorer', '9.0'),
      Browser.new('Chrome', '19.0.1036.7'),
      Browser.new('Opera', '11.00')
    ]

    def check_browser
      user_agent = UserAgent.parse(request.user_agent)

      redirect_to "/notsupportedbrowser" unless SupportedBrowsers.detect { |browser| user_agent >= browser }
    end

    def check_terms
      cookies[:go_to] = request.path

      unless cookies.permanent[ENV['TERMS_COOKIE'].to_sym]
        redirect_to "/accept_terms"
      end
    end

end
