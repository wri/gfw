class ApplicationController < ActionController::Base

  helper_method :watch_cookie?

  protect_from_forgery with: :exception

  before_action :check_browser

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def accept_terms
    session[:return_to] = params[:return_to] unless params[:return_to].nil?
    @title = 'Terms of Service'
  end

  private

    def check_browser
      redirect_to "/notsupportedbrowser" unless UserAgentValidator.user_agent_supported? request.user_agent
    end

    def check_terms
      session[:return_to] = request.fullpath
      @whitelist = [
        '80.74.134.135',
        # '127.0.0.1'
      ]
      if not @whitelist.include? request.remote_ip
        redirect_to accept_terms_path unless watch_cookie?
      end
    end


    def watch_cookie?
      is_embed = request.original_url.include?('embed') ? true : false
      cookies.permanent[ENV['TERMS_COOKIE'].to_sym] || is_embed || UserAgent.parse(request.user_agent).bot?
    end

end
