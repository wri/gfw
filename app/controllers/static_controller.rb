class StaticController < ApplicationController

  skip_before_filter :check_browser
  skip_before_filter :check_terms

  def old
    render :layout => "old"
  end

  def terms
    render :layout => "old"
  end

  def accept_and_redirect
    cookies.permanent[ENV['TERMS_COOKIE'].to_sym] = true

    redirect_to cookies[:go_to]
  end

end